import path from 'path';
import fs from 'fs';
import { NodeSSH } from 'node-ssh';
import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import { NginxConfFile } from 'nginx-conf';
import { PublishConfigParams, ConfigType, CollectInfoParams } from './types';

const isUnicodeSupported = () => {
  // 操作系统平台是否为 win32（Windows）
  if (process.platform !== 'win32') {
    // 判断 process.env.TERM 是否为 'linux'，
    return process.env.TERM !== 'linux';
  }

  return (
    Boolean(process.env.CI) || // 是否在持续集成环境中
    Boolean(process.env.WT_SESSION) || // Windows 终端环境（Windows Terminal）中的会话标识
    Boolean(process.env.TERMINUS_SUBLIME) || // Terminus 插件标识
    process.env.ConEmuTask === '{cmd::Cmder}' || // ConEmu 和 cmder 终端中的任务标识
    process.env.TERM_PROGRAM === 'Terminus-Sublime' ||
    process.env.TERM_PROGRAM === 'vscode' || // 终端程序的标识，可能是 'Terminus-Sublime' 或 'vscode'
    process.env.TERM === 'xterm-256color' ||
    process.env.TERM === 'alacritty' || // 终端类型，可能是 'xterm-256color' 或 'alacritty'
    process.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm' // 终端仿真器的标识，可能是 'JetBrains-JediTerm'
  );
};

const main = {
  info: chalk.blue('ℹ'),
  success: chalk.green('✨'),
  warning: chalk.yellow('⚠️'),
  error: chalk.red('✖️'),
  star: chalk.cyan('✵'),
  arrow: chalk.yellow('➦')
};

const fallback = {
  info: chalk.blue('i'),
  success: chalk.green('✔'),
  warning: chalk.yellow('‼'),
  error: chalk.red('✖️'),
  star: chalk.cyan('✵'),
  arrow: chalk.yellow('->')
};

export const beautyLog = isUnicodeSupported() ? main : fallback;

// 根据语义化版本规则增加版本号
export const updateVersion = (version: string) => {
  const parts = version.split('.');
  let major = parseInt(parts[0]);
  let minor = parseInt(parts[1]);
  let patch = parseInt(parts[2]);

  if (patch >= 99) {
    minor += 1;
    patch = 0;
  } else if (minor >= 99) {
    major += 1;
    minor = 0;
  } else {
    patch += 1;
  }

  return `${major}.${minor}.${patch}`;
};

// 校验文件是否存在
export const verifyFile = (path: string) => {
  return fs.existsSync(path);
};

// 判断是否是合格的文件路径
export const isValidFilePath = (path: string) => {
  // 使用正则表达式检查路径格式
  const regex = /^\/(?:[^/]+\/)*[^/]+$/;
  return regex.test(path);
};

// 获取项目发布配置信息
export const getPublishConfig = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(`${process.cwd()}/publish.config.js`);
    return config;
  } catch (error) {
    console.log(
      beautyLog.warning,
      chalk.yellowBright(
        `当前项目 ${process.cwd()}/publish.config.js 目录下未配置 publish.config.js 文件，需要手动输入配置信息`
      )
    );
    return null;
  }
};

// 连接服务器
export const onConnectServer = async ({
  host,
  port,
  username,
  password,
  ssh
}: {
  host: string;
  port: string;
  username: string;
  password: string;
  ssh: NodeSSH;
}) => {
  try {
    // 连接到服务器
    await ssh.connect({
      host,
      username,
      port,
      password,
      tryKeyboard: true
    });
  } catch (err) {
    console.log(beautyLog.error, chalk.red(`连接服务器失败: ${err}`));
    process.exit(1);
  }
};

// 获取服务器配置信息
export const getConfigServerInfo = <T extends ConfigType>(
  publishConfig: PublishConfigParams,
  configType: T,
  field: keyof PublishConfigParams[T],
  message?: boolean
) => {
  if (publishConfig?.[configType]?.[field]) {
    return publishConfig[configType][field];
  } else {
    message &&
      console.log(
        '\n' + beautyLog.warning,
        chalk.yellowBright(`未找到项目 ${chalk.cyan(configType)}.${chalk.cyan(field)} 的配置信息，请手动输入!\n`)
      );
    return undefined;
  }
};

// 获取配置信息
export const getConfigFilePath = (
  publishConfig: PublishConfigParams,
  projectName: string,
  field: keyof PublishConfigParams['projectInfo'][string],
  message?: boolean
): string | undefined => {
  const value = publishConfig?.projectInfo[projectName]?.[field] as string;
  if (field === 'isServer' && value !== undefined) {
    return value;
  } else if (value) {
    return value;
  } else {
    message &&
      console.log(
        '\n' + beautyLog.warning,
        chalk.yellowBright(`未找到项目 ${chalk.cyan(projectName)}.${chalk.cyan(field)} 的配置信息，请手动输入!\n`)
      );
    return undefined;
  }
};

// 收集服务器信息
export const onCollectServerInfo = async ({
  host,
  port,
  username,
  password,
  projectName,
  publishConfig,
  command,
  nginxRemoteFilePath,
  nginxRestartPath,
  serviceRestartPath
}: CollectInfoParams) => {
  try {
    return await prompts(
      [
        {
          name: 'host',
          type: host || getConfigServerInfo(publishConfig, 'serverInfo', 'host', true) ? null : 'text',
          message: 'host:',
          initial: getConfigServerInfo(publishConfig, 'serverInfo', 'host') || '',
          validate: (value) => (value ? true : '请输入host')
        },
        {
          name: 'port',
          type: port || getConfigServerInfo(publishConfig, 'serverInfo', 'port', true) ? null : 'text',
          message: '端口号:',
          initial: getConfigServerInfo(publishConfig, 'serverInfo', 'port') || '',
          validate: (value) => (value ? true : '请输入端口号')
        },
        {
          name: 'username',
          type: username || getConfigServerInfo(publishConfig, 'serverInfo', 'username', true) ? null : 'text',
          message: '用户名称:',
          initial: getConfigServerInfo(publishConfig, 'serverInfo', 'username') || '',
          validate: (value) => (value ? true : '请输入用户名称')
        },
        {
          name: 'nginxRemoteFilePath',
          type:
            nginxRemoteFilePath ||
            getConfigServerInfo(publishConfig, 'nginxInfo', 'remoteFilePath', projectName !== 'node') ||
            projectName === 'node'
              ? null
              : 'text',
          message: '服务器 nginx.conf 文件路径:',
          initial: getConfigServerInfo(publishConfig, 'nginxInfo', 'remoteFilePath') || '',
          validate: (value) => (isValidFilePath(value) ? true : '输入的服务器 nginx.conf 文件路径必须以 / 开头')
        },
        /**
         * 当输入了 nginxRestartPath 时、
         * 或配置文件中有 restartPath 时、
         * 或前两者都没有，并且 command 为 pull 时、
         * 或 projectName 等于 nodo 时，不显示 serviceRestartPath 字段
         */
        {
          name: 'nginxRestartPath',
          type:
            nginxRestartPath ||
            getConfigServerInfo(
              publishConfig,
              'nginxInfo',
              'restartPath',
              (command !== 'pull' && projectName === 'nginx') || command === 'push' // 判断是否需要提示
            ) ||
            (!nginxRestartPath &&
              !getConfigServerInfo(publishConfig, 'nginxInfo', 'restartPath') &&
              command === 'pull') ||
            projectName === 'node'
              ? null
              : 'text',
          message: '服务器 nginx 重启路径:',
          initial: getConfigServerInfo(publishConfig, 'nginxInfo', 'restartPath') || '',
          validate: (value) => (isValidFilePath(value) ? true : '输入的服务器 nginx 重启路径必须以 / 开头')
        },
        /**
         * 当输入了 serviceRestartPath 时、
         * 或配置文件中有 restartPath 时、
         * 或前两者都没有，并且 command 为 pull 及 push 时、
         * 或 projectName 等于 nginx 时，不显示 serviceRestartPath 字段
         */
        {
          name: 'serviceRestartPath',
          type:
            serviceRestartPath ||
            getConfigServerInfo(
              publishConfig,
              'serviceInfo',
              'restartPath',
              command === 'restart' && projectName === 'node' // 判断是否需要提示
            ) ||
            (!serviceRestartPath &&
              !getConfigServerInfo(publishConfig, 'serviceInfo', 'restartPath') &&
              command !== 'restart') ||
            projectName === 'nginx'
              ? null
              : 'text',
          message: '服务器 node 重启路径:',
          initial: getConfigServerInfo(publishConfig, 'serviceInfo', 'restartPath') || '',
          validate: (value) => (isValidFilePath(value) ? true : '输入的服务器 node 重启路径必须以 / 开头')
        },
        {
          name: 'password',
          type: password ? null : 'password',
          message: '密码:',
          initial: '',
          validate: (value) => (value ? true : '请输入密码')
        }
      ],
      {
        onCancel: () => {
          console.log(`\n${(beautyLog.error, chalk.red('已取消输入配置信息'))}\n`);
          process.exit(1);
        }
      }
    );
  } catch (err) {
    console.log(beautyLog.error, chalk.red(err));
    process.exit(1);
  }
};

// 删除本地文件
export const onRemoveFile = async (localFile: string) => {
  const spinner = ora({
    text: chalk.yellowBright(`正在删除本地文件: ${chalk.cyan(localFile)}`)
  }).start();
  return new Promise((resolve, reject) => {
    try {
      const fullPath = path.resolve(localFile);
      // 删除文件
      fs.unlink(fullPath, (err) => {
        if (err === null) {
          spinner.succeed(chalk.greenBright(`删除本地文件: ${chalk.cyan(localFile)} 成功`));
          resolve(1);
        }
      });
    } catch (err) {
      console.error(chalk.red(`Failed to delete file ${localFile}: ${err}`));
      spinner.fail(chalk.redBright(`删除本地文件: ${chalk.cyan(localFile)} 失败`));
      reject(err);
      process.exit(1);
    }
  });
};

// 校验本地 nginx 配置文件是否有效
export const onCheckNginxConfigLocal = () => {
  const spinner = ora({
    text: chalk.yellowBright(`正在检查本地 ${process.cwd()}/nginx.conf 文件是否有效`)
  }).start();
  return new Promise((resolve) => {
    try {
      NginxConfFile.create(`${process.cwd()}/nginx.conf`, function (err, conf) {
        if (err) {
          spinner.fail(chalk.redBright(`读取文件: ${chalk.cyan(`${process.cwd()}/nginx.conf`)} 出错，${err}`));
          return;
        }
        const server = conf?.nginx?.http?.[0].server;
        if (server?.length) {
          spinner.succeed(chalk.greenBright(`已将相关配置存入本地 ${chalk.cyan(`${process.cwd()}/nginx.conf`)} 文件中`));
        } else {
          spinner.fail(chalk.redBright(`本地 ${chalk.cyan(`${process.cwd()}/nginx.conf`)} 文件中配置存在问题`));
          process.exit(1);
        }
      });
      resolve(1);
    } catch (error) {
      console.error(`nginx 配置文件语法错误: ${error.message}`);
      process.exit(1);
    }
  });
};

// 校验 nginx 文件是否有效
const onCheckNginxConfig = async (remoteFilePath: string, restartPath: string, ssh: NodeSSH) => {
  const spinner = ora({
    text: chalk.yellowBright(`正在检查服务器 ${remoteFilePath} 文件是否有效`)
  }).start();
  try {
    const { code, stderr } = await ssh.execCommand(`cd ${restartPath} && ./nginx -t -c ${remoteFilePath}`);
    if (code === 0 && stderr.includes('test is successful')) {
      spinner.succeed(chalk.greenBright(`服务器 ${chalk.cyan(remoteFilePath)} 文件配置无误`));
    } else {
      spinner.fail(chalk.redBright(`服务器 ${chalk.cyan(remoteFilePath)} 文件配置存在问题`));
      process.exit(0);
    }
  } catch (error) {
    spinner.fail(chalk.redBright(`服务器 ${chalk.cyan(remoteFilePath)} 文件校验失败`));
    process.exit(0);
  }
};

// 重启 nginx 服务
export const onRestartNginx = async (remoteFilePath: string, restartPath: string, ssh: NodeSSH) => {
  await onCheckNginxConfig(remoteFilePath, restartPath, ssh);
  const spinner = ora({
    text: chalk.yellowBright('正在重启 nginx 服务')
  }).start();
  try {
    await ssh.execCommand(`cd ${restartPath} && ./nginx -s reload`);
    spinner.succeed(chalk.greenBright(`nginx 服务已重启: ${restartPath}`));
    await onRemoveFile(`${process.cwd()}/nginx.conf`);
    console.log(
      `\n${beautyLog.success}`,
      chalk.greenBright(`${chalk.bold(`🎉 🎉 🎉 nginx 服务重启成功 ${restartPath} 🎉 🎉 🎉`)}\n`)
    );
  } catch (error) {
    spinner.fail(chalk.redBright(`重启 nginx 服务失败: ${error}`));
    process.exit(0);
  }
};

// 重启后台项目
export const onRestartServer = async (remotePath: string, ssh: NodeSSH) => {
  const spinner = ora({
    text: chalk.yellowBright(chalk.cyan('正在重启服务...'))
  }).start();
  try {
    const { code: deleteCode, stderr: deleteStderr } = await ssh.execCommand('pm2 delete 0');
    const { code: startCode, stderr: startStderr } = await ssh.execCommand(`pm2 start ${remotePath}/src/main.js`);
    const { code: listCode, stdout } = await ssh.execCommand('pm2 list');
    if (deleteCode === 0 && startCode === 0 && listCode === 0) {
      spinner.succeed(chalk.greenBright(`服务启动成功: \n${stdout}`));
      await onRemoveFile(`${process.cwd()}/nginx.conf`);
      console.log(
        `\n${beautyLog.success}`,
        chalk.greenBright(`${chalk.bold(`🎉 🎉 🎉 node 服务重启成功: ${chalk.cyan(`${remotePath}`)}!!! 🎉 🎉 🎉 \n`)}`)
      );
    } else {
      spinner.fail(chalk.redBright(`服务启动失败: ${deleteStderr || startStderr}`));
      process.exit(1);
    }
  } catch (error) {
    spinner.fail(chalk.redBright(`服务启动失败: ${error}`));
    process.exit(1);
  }
};
