import path from 'node:path';
import fs from 'fs-extra';
import { NodeSSH } from 'node-ssh';
import prompts from 'prompts';
import cliProgress from 'cli-progress';
import archiver from 'archiver';
import chalk from 'chalk';
import ora from 'ora';
import {
  beautyLog,
  getConfigFilePath,
  getPublishConfig,
  getConfigServerInfo,
  onRestartServer,
  onRemoveFile
} from './utils';
import { Options, PublishConfigParams } from './typings';

let result: Partial<Options> = {};

const ssh = new NodeSSH();

// 压缩 dist
const onCompressFile = async (localFilePath: string) => {
  return new Promise((resolve, reject) => {
    const spinner = ora({
      text: chalk.yellowBright(`正在压缩文件: ${chalk.cyan(`${localFilePath}/dist`)}`)
    }).start();
    const archive = archiver('zip', {
      zlib: { level: 9 }
    }).on('error', (err: Error) => {
      console.log(beautyLog.error, chalk.red(`压缩文件失败: ${err}`));
    });
    const output = fs.createWriteStream(`${localFilePath}/dist.zip`);
    output.on('close', (err: Error) => {
      if (err) {
        spinner.fail(chalk.redBright(`压缩文件: ${chalk.cyan(`${localFilePath}/dist`)} 失败`));
        console.log(beautyLog.error, chalk.red(`压缩文件失败: ${err}`));
        reject(err);
        process.exit(1);
      }
      spinner.succeed(chalk.greenBright(`压缩文件: ${chalk.cyan(`${localFilePath}/dist`)} 成功`));
      resolve(1);
    });
    archive.pipe(output);
    // 第二参数表示在压缩包中创建 dist 目录，将压缩内容放在 dist 目录下，而不是散列到压缩包的根目录
    archive.directory(`${localFilePath}/dist`, '/dist');
    archive.finalize();
  });
};

// 压缩服务dist
const onCompressServiceFile = async (localFilePath: string) => {
  return new Promise((resolve, reject) => {
    const spinner = ora({
      text: chalk.yellowBright(`正在压缩文件: ${chalk.cyan(`${localFilePath}/dist`)}`)
    }).start();
    const srcPath = `${localFilePath}/src`;
    const uploadPath = `${srcPath}/upload`;
    const tempUploadPath = `${localFilePath}/upload`;
    fs.moveSync(uploadPath, tempUploadPath, { overwrite: true });
    const archive = archiver('zip', {
      zlib: { level: 9 }
    }).on('error', (err: Error) => {
      console.log(beautyLog.error, chalk.red(`压缩文件失败: ${err}`));
    });
    const output = fs.createWriteStream(`${localFilePath}/dist.zip`);
    output.on('close', (err: Error) => {
      if (!err) {
        fs.moveSync(tempUploadPath, uploadPath, { overwrite: true });
        spinner.succeed(chalk.greenBright(`压缩文件: ${chalk.cyan(`${localFilePath}/src`)} 等文件成功`));
        resolve(1);
      } else {
        spinner.fail(chalk.redBright(`压缩文件: ${chalk.cyan(`${localFilePath}/src`)} 等文件失败`));
        console.log(beautyLog.error, chalk.red(`压缩文件失败: ${err}`));
        reject(err);
        process.exit(1);
      }
    });
    archive.pipe(output);
    archive.directory(`${localFilePath}/src`, '/src');
    archive.file(path.join(localFilePath, 'package.json'), { name: 'package.json' });
    archive.file(path.join(localFilePath, 'yarn.lock'), { name: 'yarn.lock' });
    archive.finalize();
  });
};

// 上传文件
const onPutFile = async (localFilePath: string, remoteFilePath: string) => {
  try {
    const progressBar = new cliProgress.SingleBar({
      format: '文件上传中: {bar} | {percentage}% | ETA: {eta}s | {value}MB / {total}MB',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    });
    const localFile = path.resolve(__dirname, `${localFilePath}/dist.zip`);
    const remotePath = path.join(remoteFilePath, path.basename(localFile));
    const stats = fs.statSync(localFile);
    const fileSize = stats.size;
    progressBar.start(Math.ceil(fileSize / 1024 / 1024), 0);
    await ssh.putFile(localFile, remotePath, null, {
      concurrency: 10, // 控制上传的并发数
      chunkSize: 16384, // 指定每个数据块的大小，适应慢速连接 16kb
      step: (totalTransferred: number) => {
        progressBar.update(Math.ceil(totalTransferred / 1024 / 1024));
      }
    });
    progressBar.stop();
  } catch (error) {
    console.log(beautyLog.error, chalk.red(`上传文件失败: ${error}`));
    process.exit(1);
  }
};

// 删除文件
const onDeleteFile = async (localFile: string) => {
  const spinner = ora({
    text: chalk.yellowBright(`正在删除文件: ${chalk.cyan(localFile)}`)
  }).start();
  try {
    await ssh.execCommand(`rm -rf ${localFile}`);
    spinner.succeed(chalk.greenBright(`删除文件: ${chalk.cyan(`${localFile}`)} 成功`));
  } catch (err) {
    spinner.fail(chalk.redBright(`删除文件: ${chalk.cyan(`${localFile}`)} 失败，${err}`));
    process.exit(1);
  }
};

// 解压文件
const onUnzipZip = async (remotePath: string) => {
  const spinner = ora({
    text: chalk.yellowBright(`正在解压文件: ${chalk.cyan(`${remotePath}/dist.zip`)}`)
  }).start();
  try {
    await ssh.execCommand(`unzip -o ${`${remotePath}/dist.zip`} -d ${remotePath}`);
    spinner.succeed(chalk.greenBright(`解压文件: ${chalk.cyan(`${remotePath}/dist.zip`)} 成功`));
    await onDeleteFile(`${remotePath}/dist.zip`);
    console.log(
      `\n${beautyLog.success}`,
      chalk.greenBright(`${chalk.bold(`🎉 🎉 🎉 前端资源部署成功: ${chalk.cyan(`${remotePath}`)} 🎉 🎉 🎉`)}\n`)
    );
  } catch (err) {
    console.log(beautyLog.error, chalk.red(`Failed to unzip dist.zip: ${err}`));
    spinner.fail(chalk.redBright(`解压文件: ${chalk.cyan(`${remotePath}/dist.zip`)} 失败`));
    process.exit(1);
  }
};

// 服务器安装依赖
const onInstall = async (remotePath: string) => {
  const spinner = ora({
    text: chalk.yellowBright(chalk.cyan('正在安装依赖...'))
  }).start();
  try {
    const { code, stdout, stderr } = await ssh.execCommand(`cd ${remotePath} && yarn install`);
    if (code === 0) {
      spinner.succeed(chalk.greenBright(`依赖安装成功: \n ${stdout} \n`));
    } else {
      spinner.fail(chalk.redBright(`依赖安装失败: ${stderr}`));
      process.exit(1);
    }
  } catch (error) {
    spinner.fail(chalk.redBright(`依赖安装失败: ${error}`));
    process.exit(1);
  }
};

// 连接服务器
const onConnectServer = async ({
  host,
  port,
  username,
  password
}: Pick<Options, 'host' | 'port' | 'username' | 'password'>) => {
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

// 连接服务器并上传文件
const onPublish = async ({
  username,
  host,
  port,
  password,
  localFilePath,
  remoteFilePath,
  projectName,
  install,
  publishConfig
}: Omit<Options, 'isServer'> & { projectName: string; publishConfig: PublishConfigParams }) => {
  try {
    await onConnectServer({
      host,
      username,
      port,
      password
    });
    // 判断是否是服务端项目
    if (getConfigFilePath(publishConfig, projectName, 'isServer')) {
      await onCompressServiceFile(localFilePath);
    } else {
      await onCompressFile(localFilePath);
    }
    await onPutFile(localFilePath, remoteFilePath);
    await onDeleteFile(`${remoteFilePath}/dist`);
    await onUnzipZip(remoteFilePath);
    await onRemoveFile(`${localFilePath}/dist.zip`);
    if (install) {
      await onInstall(remoteFilePath);
    }
    if (getConfigFilePath(publishConfig, projectName, 'isServer')) {
      await onRestartServer(remoteFilePath, ssh);
    }
  } catch (err) {
    console.log(beautyLog.error, chalk.red(`部署失败: ${err}`));
  } finally {
    // 关闭 SSH 连接
    ssh.dispose();
  }
};

export const publish = async (projectName: string, options: Options) => {
  const {
    host: _host,
    port: _port,
    username: _username,
    password: _password,
    localFilePath: _localFilePath,
    remoteFilePath: _remoteFilePath,
    install: _install
  } = options;

  const publishConfig = getPublishConfig();

  const getInstallStatus = (isServer: boolean) => {
    return !!(_install || (publishConfig ? !publishConfig?.porjectInfo[projectName]?.isServer : !isServer));
  };

  try {
    result = await prompts(
      [
        {
          name: 'host',
          type: _host || getConfigServerInfo(publishConfig, 'host', true) ? null : 'text',
          message: 'host:',
          initial: getConfigServerInfo(publishConfig, 'host') || '',
          validate: (value) => (value ? true : '请输入host')
        },
        {
          name: 'port',
          type: _port || getConfigServerInfo(publishConfig, 'port', true) ? null : 'text',
          message: '端口号:',
          initial: getConfigServerInfo(publishConfig, 'port') || '',
          validate: (value) => (value ? true : '请输入端口号')
        },
        {
          name: 'localFilePath',
          type: _localFilePath || getConfigFilePath(publishConfig, projectName, 'localFilePath', true) ? null : 'text',
          message: '本地项目文件路径:',
          initial: process.cwd(),
          validate: (value) => (value ? true : '请输入本地项目文件路径')
        },
        {
          name: 'remoteFilePath',
          type:
            _remoteFilePath || getConfigFilePath(publishConfig, projectName, 'remoteFilePath', true) ? null : 'text',
          message: '目标服务器项目文件路径:',
          initial: getConfigFilePath(publishConfig, projectName, 'remoteFilePath') || '',
          validate: (value) => (value ? true : '请输入目标服务器项目文件路径')
        },
        {
          name: 'isServer',
          type:
            _install || getConfigFilePath(publishConfig, projectName, 'isServer', true) !== undefined ? null : 'toggle',
          message: '是否是后台服务:',
          initial: false,
          active: 'yes',
          inactive: 'no'
        },
        {
          name: 'install',
          type: (_, values) => (getInstallStatus(values.isServer) ? null : 'toggle'),
          message: '是否安装依赖:',
          initial: false,
          active: 'yes',
          inactive: 'no'
        },
        {
          name: 'username',
          type: _username || getConfigServerInfo(publishConfig, 'username', true) ? null : 'text',
          message: '用户名称:',
          initial: getConfigServerInfo(publishConfig, 'username') || '',
          validate: (value) => (value ? true : '请输入用户名称')
        },
        {
          name: 'password',
          type: _password ? null : 'password',
          message: '密码:',
          validate: (value) => (value ? true : '请输入密码')
        }
      ],
      {
        onCancel: () => {
          throw new Error('User cancelled');
        }
      }
    );
  } catch (cancelled) {
    process.exit(1);
  }

  const { host, port, username, password, localFilePath, remoteFilePath, install } = result;

  await onPublish({
    host: host || _host || (getConfigServerInfo(publishConfig, 'host') as string),
    port: port || _port || (getConfigServerInfo(publishConfig, 'port') as string),
    username: username || _username || (getConfigServerInfo(publishConfig, 'username') as string),
    password: password || _password,
    localFilePath:
      localFilePath ||
      _localFilePath ||
      getConfigFilePath(publishConfig, projectName, 'localFilePath') ||
      process.cwd(),
    remoteFilePath:
      remoteFilePath || _remoteFilePath || getConfigFilePath(publishConfig, projectName, 'remoteFilePath'),
    install: install || _install,
    projectName,
    publishConfig
  });
};
