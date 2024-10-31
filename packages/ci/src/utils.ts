import path from 'path';
import fs from 'fs';
import { NodeSSH } from 'node-ssh';
import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import { NginxConfFile } from 'nginx-conf';
import {
  Options,
  PublishConfigParams,
  CollectInfoParams,
  ProjectInfo,
  ServerInfo,
  NginxInfo,
  ServiceInfo
} from './types';

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
  error: chalk.red('×'),
  star: chalk.cyan('✵'),
  arrow: chalk.yellow('➦')
};

const fallback = {
  info: chalk.blue('i'),
  success: chalk.green('✔'),
  warning: chalk.yellow('‼'),
  error: chalk.red('×'),
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

// 兼容路径
export const ompatiblePath = (url: string, url2 = '') => {
  return url2 ? path.join(url, url2) : path.resolve(url);
};

// 校验文件是否存在
export const verifyFile = (url: string) => {
  return fs.existsSync(ompatiblePath(url));
};

// 校验文件夹是否存在
export const verifyFolder = (url: string) => {
  try {
    const stats = fs.statSync(ompatiblePath(url));
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
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
    const config = JSON.parse(fs.readFileSync(`${ompatiblePath(process.cwd(), 'publish.config.json')}`, 'utf8'));
    return config;
  } catch (error) {
    console.log(beautyLog.warning, chalk.redBright(`未找到 ${chalk.cyan('publish.config.json')} 相关发布配置`));
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
}: Pick<Options, 'host' | 'port' | 'username' | 'password'> & { ssh: NodeSSH }) => {
  const spinner = ora({
    text: chalk.yellowBright(chalk.cyan(`正在连接服务器: ${username}@${host}:${port} ...`))
  }).start();
  try {
    // 连接到服务器
    await ssh.connect({
      host,
      username,
      port,
      password,
      tryKeyboard: true
    });
    spinner.succeed(chalk.greenBright('服务器连接成功!!!'));
  } catch (err) {
    spinner.fail(chalk.redBright(`服务器连接失败: ${err}`));
    process.exit(1);
  }
};

export const getPublishConfigInfo = (
  publishConfig: PublishConfigParams,
  projectName: string,
  field: string,
  message?: boolean
): string | boolean | undefined => {
  const value = publishConfig?.[projectName]?.[
    field as keyof (ProjectInfo | ServerInfo | NginxInfo | ServiceInfo)
  ] as string;
  if (field === 'isServer' && value !== undefined) {
    return value;
  } else if (value) {
    return value;
  } else {
    message &&
      console.log(
        '\n' + beautyLog.warning,
        chalk.yellowBright(`未获取到项目 ${chalk.cyan(projectName)}.${chalk.cyan(field)} 的配置信息，请手动输入!\n`)
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
          type: host || getPublishConfigInfo(publishConfig, 'serverInfo', 'host', true) ? null : 'text',
          message: 'host:',
          initial: getPublishConfigInfo(publishConfig, 'serverInfo', 'host') || '',
          validate: (value) => (value ? true : '请输入host')
        },
        {
          name: 'port',
          type: port || getPublishConfigInfo(publishConfig, 'serverInfo', 'port', true) ? null : 'text',
          message: '端口号:',
          initial: getPublishConfigInfo(publishConfig, 'serverInfo', 'port') || '',
          validate: (value) => (value ? true : '请输入端口号')
        },
        {
          name: 'username',
          type: username || getPublishConfigInfo(publishConfig, 'serverInfo', 'username', true) ? null : 'text',
          message: '用户名称:',
          initial: getPublishConfigInfo(publishConfig, 'serverInfo', 'username') || '',
          validate: (value) => (value ? true : '请输入用户名称')
        },
        {
          name: 'nginxRemoteFilePath',
          type:
            nginxRemoteFilePath ||
              getPublishConfigInfo(publishConfig, 'nginxInfo', 'remoteFilePath', projectName !== 'node') ||
              projectName === 'node'
              ? null
              : 'text',
          message: '服务器 nginx.conf 文件路径:',
          initial: getPublishConfigInfo(publishConfig, 'nginxInfo', 'remoteFilePath') || '',
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
              getPublishConfigInfo(
                publishConfig,
                'nginxInfo',
                'restartPath',
                (command !== 'pull' && projectName === 'nginx') || command === 'push' // 判断是否需要提示
              ) ||
              (!nginxRestartPath &&
                !getPublishConfigInfo(publishConfig, 'nginxInfo', 'restartPath') &&
                command === 'pull') ||
              projectName === 'node'
              ? null
              : 'text',
          message: '服务器 nginx 重启路径:',
          initial: getPublishConfigInfo(publishConfig, 'nginxInfo', 'restartPath') || '',
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
              getPublishConfigInfo(
                publishConfig,
                'serviceInfo',
                'restartPath',
                command === 'restart' && projectName === 'node' // 判断是否需要提示
              ) ||
              (!serviceRestartPath &&
                !getPublishConfigInfo(publishConfig, 'serviceInfo', 'restartPath') &&
                command !== 'restart') ||
              projectName === 'nginx'
              ? null
              : 'text',
          message: '服务器 node 重启路径:',
          initial: getPublishConfigInfo(publishConfig, 'serviceInfo', 'restartPath') || '',
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
          console.log(`\n${beautyLog.error}`, chalk.red('已取消输入配置信息\n'));
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
  const fullPath = ompatiblePath(localFile);
  const spinner = ora({
    text: chalk.yellowBright(`正在删除本地文件: ${chalk.cyan(fullPath)} ...`)
  }).start();
  return new Promise((resolve) => {
    try {
      // 删除文件
      fs.unlink(fullPath, (err) => {
        if (err === null) {
          spinner.succeed(chalk.greenBright(`删除本地文件: ${chalk.cyan(fullPath)} 成功`));
          resolve(1);
        }
      });
    } catch (err) {
      spinner.fail(chalk.redBright(`删除本地文件: ${chalk.cyan(fullPath)} 失败，${err}`));
      process.exit(1);
    }
  });
};

// 删除服务器文件
export const onRemoveServerFile = async (localFile: string, ssh: NodeSSH) => {
  const spinner = ora({
    text: chalk.yellowBright(`正在删除服务器文件: ${chalk.cyan(localFile)} ...`)
  }).start();
  try {
    await ssh.execCommand(`rm -rf ${localFile}`);
    spinner.succeed(chalk.greenBright(`删除服务器文件: ${chalk.cyan(`${localFile}`)} 成功`));
  } catch (err) {
    spinner.fail(chalk.redBright(`删除服务器文件: ${chalk.cyan(`${localFile}`)} 失败，${err}`));
    process.exit(1);
  }
};

// 校验本地 nginx 配置文件是否有效
export const onCheckNginxConfigLocal = () => {
  return new Promise((resolve) => {
    const nginxConfPath = ompatiblePath(process.cwd(), 'nginx.conf');
    try {
      NginxConfFile.create(nginxConfPath, (err, conf) => {
        if (err) {
          console.log(beautyLog.error, chalk.redBright(`读取文件: ${chalk.cyan(nginxConfPath)} 出错，${err}`));
          return;
        }
        const server = conf?.nginx?.http?.[0].server;
        if (!server?.length) {
          console.log(beautyLog.error, chalk.redBright(`本地 ${chalk.cyan(nginxConfPath)} 文件中配置存在问题`));
          process.exit(1);
        }
      });
      resolve(1);
    } catch (error) {
      console.log(
        beautyLog.error,
        chalk.redBright(`本地 ${chalk.cyan(`${process.cwd()}/nginx.conf`)} 文件中配置存在问题`)
      );
      process.exit(1);
    }
  });
};

// 校验 nginx 文件是否有效
const onCheckNginxConfig = async (remoteFilePath: string, restartPath: string, ssh: NodeSSH) => {
  restartPath = ompatiblePath(restartPath);
  remoteFilePath = ompatiblePath(remoteFilePath);
  const spinner = ora({
    text: chalk.yellowBright(`正在检查服务器 ${remoteFilePath} 文件是否有效...`)
  }).start();
  try {
    const { code, stderr } = await ssh.execCommand(
      `cd ${ompatiblePath(restartPath)} && ./nginx -t -c ${remoteFilePath}`
    );
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

// 校验服务器文件是否存在
export const checkFileExistence = async (url: string, ssh: NodeSSH) => {
  try {
    const res = await ssh.execCommand(`ls ${ompatiblePath(url)}`);
    if (res.code !== 0 && res.stderr) {
      console.error(chalk.redBright(`服务器文件 ${chalk.cyan(path)} - ${res.stderr}`));
      process.exit(1);
    }
  } catch (err) {
    console.error(chalk.redBright(`服务器 ${chalk.cyan(path)} 文件检测失败，${err}`));
    process.exit(1);
  }
};

// 重启 nginx 服务
export const onRestartNginx = async (remoteFilePath: string, restartPath: string, ssh: NodeSSH) => {
  await onCheckNginxConfig(remoteFilePath, restartPath, ssh);
  const spinner = ora({
    text: chalk.yellowBright('正在重启 nginx 服务...')
  }).start();
  try {
    await ssh.execCommand(`cd ${ompatiblePath(restartPath)} && ./nginx -s reload`);
    spinner.succeed(chalk.greenBright(`nginx 服务已重启: ${ompatiblePath(restartPath)}`));
    if (verifyFile(`${process.cwd()}/nginx.conf`)) {
      await onRemoveFile(`${process.cwd()}/nginx.conf`);
    }
    console.log(
      `\n${beautyLog.success}`,
      chalk.greenBright(`${chalk.bold(`🎉 🎉 🎉 nginx 服务重启成功 ${ompatiblePath(restartPath)} 🎉 🎉 🎉`)}\n`)
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
    const { code: restartCode, stderr: restartStderr } = await ssh.execCommand('pm2 restart 0');
    const { code: listCode, stdout } = await ssh.execCommand('pm2 list');
    if (restartCode === 0 && listCode === 0) {
      spinner.succeed(chalk.greenBright(`服务启动成功: \n${stdout}`));
      console.log(
        `\n${beautyLog.success}`,
        chalk.greenBright(`${chalk.bold(`🎉 🎉 🎉 node 服务重启成功: ${chalk.cyan(`${remotePath}`)}!!! 🎉 🎉 🎉 \n`)}`)
      );
    } else {
      spinner.fail(chalk.redBright(`服务启动失败: ${restartStderr}`));
      process.exit(1);
    }
  } catch (error) {
    spinner.fail(chalk.redBright(`服务启动失败: ${error}`));
    process.exit(1);
  }
};
