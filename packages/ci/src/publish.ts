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
  getPublishConfig,
  onConnectServer,
  getPublishConfigInfo,
  onRestartServer,
  onRemoveFile,
  onRemoveServerFile,
  verifyFile,
  verifyFolder,
  ompatiblePath
} from './utils';
import { Options, PublishConfigParams } from './types';

let result: Partial<Options> = {};

const ssh = new NodeSSH();

// 校验文件
const onVerifyFile = (localFilePath: string, isServer: boolean) => {
  if (!isServer && !verifyFolder(`${localFilePath}/dist`)) {
    console.log(
      beautyLog.error,
      chalk.red(`本地 ${ompatiblePath(localFilePath, 'dist')} 文件不存在，请先将项目进行打包后再发布`)
    );
    process.exit(1);
  }
  if (isServer && (!verifyFolder(`${localFilePath}/src`) || !verifyFile(`${localFilePath}/package.json`))) {
    console.log(
      beautyLog.error,
      chalk.red(`本地 ${ompatiblePath(localFilePath, 'src')} 或 package.json 等文件不存在，无法发布`)
    );
    process.exit(1);
  }
};

// 压缩 dist
const onCompressFile = async (localFilePath: string) => {
  return new Promise((resolve, reject) => {
    const spinner = ora({
      text: chalk.yellowBright(`正在压缩本地文件: ${chalk.cyan(ompatiblePath(localFilePath, 'dist'))} ...`)
    }).start();
    const archive = archiver('zip', {
      zlib: { level: 9 }
    }).on('error', (err: Error) => {
      console.log(beautyLog.error, chalk.red(`压缩本地文件失败: ${err}`));
    });
    const output = fs.createWriteStream(ompatiblePath(localFilePath, 'dist.zip'));
    output.on('close', (err: Error) => {
      if (err) {
        spinner.fail(chalk.redBright(`压缩文件: ${chalk.cyan(ompatiblePath(localFilePath, 'dist'))} 失败`));
        console.log(beautyLog.error, chalk.red(`压缩本地文件失败: ${err}`));
        reject(err);
        process.exit(1);
      }
      spinner.succeed(chalk.greenBright(`压缩本地文件: ${chalk.cyan(ompatiblePath(localFilePath, 'dist'))} 成功`));
      resolve(1);
    });
    archive.pipe(output);
    // 第二参数表示在压缩包中创建 dist 目录，将压缩内容放在 dist 目录下，而不是散列到压缩包的根目录
    archive.directory(ompatiblePath(localFilePath, 'dist'), '/dist');
    archive.finalize();
  });
};

// 压缩服务dist
const onCompressServiceFile = async (localFilePath: string) => {
  return new Promise((resolve, reject) => {
    const spinner = ora({
      text: chalk.yellowBright(`正在压缩本地文件: ${chalk.cyan(ompatiblePath(localFilePath, 'dist'))} ...`)
    }).start();
    const srcPath = `${localFilePath}/src`;
    const uploadPath = `${srcPath}/upload`;
    const tempUploadPath = `${localFilePath}/upload`;
    fs.moveSync(uploadPath, tempUploadPath, { overwrite: true });
    const archive = archiver('zip', {
      zlib: { level: 9 }
    }).on('error', (err: Error) => {
      console.log(beautyLog.error, chalk.red(`压缩本地文件失败: ${err}`));
    });
    const output = fs.createWriteStream(ompatiblePath(localFilePath, 'dist.zip'));
    output.on('close', (err: Error) => {
      if (!err) {
        fs.moveSync(tempUploadPath, uploadPath, { overwrite: true });
        spinner.succeed(
          chalk.greenBright(`压缩本地文件: ${chalk.cyan(ompatiblePath(localFilePath, 'src'))} 等文件成功`)
        );
        resolve(1);
      } else {
        spinner.fail(chalk.redBright(`压缩本地文件: ${chalk.cyan(ompatiblePath(localFilePath, 'src'))} 等文件失败`));
        console.log(beautyLog.error, chalk.red(`压缩本地文件失败: ${err}`));
        reject(err);
        process.exit(1);
      }
    });
    archive.pipe(output);
    archive.directory(ompatiblePath(localFilePath, 'src'), '/src');
    archive.file(path.join(localFilePath, 'package.json'), { name: 'package.json' });
    if (verifyFile(`${localFilePath}/yarn.lock`)) {
      archive.file(path.join(localFilePath, 'yarn.lock'), { name: 'yarn.lock' });
    }
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

// 解压文件
const onUnzipZip = async (remotePath: string, isServer: boolean) => {
  const spinner = ora({
    text: chalk.yellowBright(`正在解压服务器文件: ${chalk.cyan(`${remotePath}/dist.zip`)} ...`)
  }).start();
  try {
    await ssh.execCommand(`unzip -o ${`${remotePath}/dist.zip`} -d ${remotePath}`);
    spinner.succeed(chalk.greenBright(`解压服务器文件: ${chalk.cyan(`${remotePath}/dist.zip`)} 成功`));
    await onRemoveServerFile(`${remotePath}/dist.zip`, ssh);
    !isServer &&
      console.log(
        `\n${beautyLog.success}`,
        chalk.greenBright(`${chalk.bold(`🎉 🎉 🎉 前端资源部署成功: ${chalk.cyan(`${remotePath}`)} 🎉 🎉 🎉`)}\n`)
      );
  } catch (err) {
    console.log(beautyLog.error, chalk.red(`Failed to unzip dist.zip: ${err}`));
    spinner.fail(chalk.redBright(`解压服务器文件: ${chalk.cyan(`${remotePath}/dist.zip`)} 失败`));
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

// 连接服务器并上传文件
const onPublish = async ({
  username,
  host,
  port,
  password,
  localFilePath,
  remoteFilePath,
  install,
  isServer,
  restartScript
}: Options & { restartScript?: string }) => {
  try {
    await onConnectServer({
      host,
      username,
      port,
      password,
      ssh
    });
    if (isServer) {
      await onCompressServiceFile(localFilePath);
    } else {
      await onCompressFile(localFilePath);
    }
    await onPutFile(localFilePath, remoteFilePath);
    await onRemoveServerFile(`${remoteFilePath}/dist`, ssh);
    await onUnzipZip(remoteFilePath, isServer);
    await onRemoveFile(`${localFilePath}/dist.zip`);
    if (install && isServer) {
      await onInstall(remoteFilePath);
    }
    if (isServer) {
      await onRestartServer(remoteFilePath, ssh, restartScript);
    }
  } catch (err) {
    console.log(`\n${beautyLog.error}`, chalk.red(`部署失败: ${err}`));
    process.exit(1);
  } finally {
    // 关闭 SSH 连接
    ssh.dispose();
  }
};

export const publish = async (projectName: string, options: Omit<Options, 'isServer'> & { isServer: string }) => {
  const {
    host: _host,
    port: _port,
    username: _username,
    password: _password,
    localFilePath: _localFilePath,
    remoteFilePath: _remoteFilePath,
    install: _install,
    isServer: _isServer
  } = options;

  // 标识是否已经校验
  let isVerified = false;

  const publishConfig: PublishConfigParams = getPublishConfig();

  const isService = getPublishConfigInfo(publishConfig, projectName, 'isServer');

  const localPath =
    _localFilePath || getPublishConfigInfo(publishConfig, projectName, 'localFilePath') || `${process.cwd()}`;

  // 发布配置中 isServer 配置存在时，直接校验
  if (localPath && (isService !== undefined || _isServer !== undefined)) {
    onVerifyFile(localPath, _isServer === 'true' || !!isService);
    isVerified = true;
  }

  try {
    const verifyIsServer = (options: Options) => {
      /**
       * 判断是否输入了 isServer 选项，并且 isServer 选项的值为 true 时，则显示安装依赖选项
       * 判断是否携带 -i 参数，如果未携带，则显示安装依赖选项
       * 如果 publish.config.json 中配置了 isServer 为 true 时，则显示安装依赖选项
       */
      const needInstall = (_isServer === 'true' || options.isServer || isService) && _install === undefined;

      !isVerified &&
        onVerifyFile(
          _localFilePath ||
            options.localFilePath ||
            (getPublishConfigInfo(publishConfig, projectName, 'localFilePath') as string) ||
            process.cwd(),
          _isServer === 'true' || options.isServer || !!isService
        );

      return needInstall;
    };

    result = await prompts(
      [
        {
          name: 'host',
          type: _host || getPublishConfigInfo(publishConfig, 'serverInfo', 'host', true) ? null : 'text',
          message: 'host:',
          initial: getPublishConfigInfo(publishConfig, 'serverInfo', 'host') || '',
          validate: (value) => (value ? true : '请输入host')
        },
        {
          name: 'port',
          type: _port || getPublishConfigInfo(publishConfig, 'serverInfo', 'port', true) ? null : 'text',
          message: '端口号:',
          initial: getPublishConfigInfo(publishConfig, 'serverInfo', 'port') || '',
          validate: (value) => (value ? true : '请输入端口号')
        },
        {
          name: 'localFilePath',
          type:
            _localFilePath || getPublishConfigInfo(publishConfig, projectName, 'localFilePath', true) ? null : 'text',
          message: '本地项目文件路径:',
          initial: process.cwd(),
          validate: (value) => (value ? true : '请输入本地项目文件路径')
        },
        {
          name: 'remoteFilePath',
          type:
            _remoteFilePath || getPublishConfigInfo(publishConfig, projectName, 'remoteFilePath', true) ? null : 'text',
          message: '目标服务器项目文件路径:',
          initial: getPublishConfigInfo(publishConfig, projectName, 'remoteFilePath') || '',
          validate: (value) => (value ? true : '请输入目标服务器项目文件路径')
        },
        {
          name: 'isServer',
          type:
            _isServer !== undefined ||
            _install ||
            getPublishConfigInfo(publishConfig, projectName, 'isServer', true) !== undefined
              ? null
              : 'toggle',
          message: '是否是后台服务:',
          initial: false,
          active: 'yes',
          inactive: 'no'
        },
        {
          name: 'install',
          type: (_, values) => {
            // isServer 为 true 时，或者 publish.config.json 中没有配置 isServer 为 true 时，或者 _install 没有传入了值时，才显示安装依赖选项
            return !verifyIsServer(values) ? null : 'toggle';
          },
          message: '是否安装依赖:',
          initial: false,
          active: 'yes',
          inactive: 'no'
        },
        {
          name: 'username',
          type: _username || getPublishConfigInfo(publishConfig, 'serverInfo', 'username', true) ? null : 'text',
          message: '用户名称:',
          initial: getPublishConfigInfo(publishConfig, 'serverInfo', 'username') || '',
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
          console.log(`\n${beautyLog.error}`, chalk.red('已取消输入配置信息\n'));
          process.exit(1);
        }
      }
    );
  } catch (err) {
    console.log(`\n${beautyLog.error}`, `${chalk.red('请检查 publish.config.json 发布配置或者输入信息是否有误!')}\n`);
    console.log(beautyLog.error, chalk.red(`${err}!\n`));
    process.exit(1);
  }

  const { host, port, username, password, localFilePath, remoteFilePath, install, isServer } = result;

  await onPublish({
    host: host || _host || (getPublishConfigInfo(publishConfig, 'serverInfo', 'host') as string),
    port: port || _port || (getPublishConfigInfo(publishConfig, 'serverInfo', 'port') as string),
    username: username || _username || (getPublishConfigInfo(publishConfig, 'serverInfo', 'username') as string),
    password: password || _password,
    localFilePath:
      localFilePath ||
      _localFilePath ||
      (getPublishConfigInfo(publishConfig, projectName, 'localFilePath') as string) ||
      process.cwd(),
    remoteFilePath:
      remoteFilePath ||
      _remoteFilePath ||
      (getPublishConfigInfo(publishConfig, projectName, 'remoteFilePath') as string),
    install: install || _install,
    isServer: _isServer ? _isServer === 'true' : isServer || !!isService,
    restartScript: publishConfig?.restartScript
  });
};
