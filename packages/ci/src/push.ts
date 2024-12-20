import { NodeSSH } from 'node-ssh';
import chalk from 'chalk';
import ora from 'ora';
import {
  beautyLog,
  getPublishConfig,
  onConnectServer,
  onCollectServerInfo,
  onRestartNginx,
  onCheckNginxConfigLocal,
  checkFileExistence,
  onRemoveServerFile,
  ompatiblePath
} from './utils';
import { Options, PublishConfigParams, CollectInfoParams } from './types';

const ssh = new NodeSSH();

// 备份远程 nginx 配置
const onBackupNginxConfig = async (remoteFilePath: string, backupPath = `${remoteFilePath}/nginx_copy.conf`) => {
  const spinner = ora({
    text: chalk.yellowBright('正在备份远程 nginx.conf 文件...')
  }).start();
  try {
    // 备份远程文件
    await ssh.execCommand(`cp ${remoteFilePath}/nginx.conf ${backupPath}`);
    spinner.succeed(chalk.greenBright(`成功备份 ${remoteFilePath}/nginx.conf 文件到 ${backupPath}`));
  } catch (error) {
    spinner.fail(chalk.redBright(`备份 ${remoteFilePath}/nginx.conf 文件到 ${backupPath} 失败: ${error}`));
  }
};

// 读取本地 nginx 配置并推送到远程服务器
const onPutNginxConfig = async (localFilePath: string, remoteFilePath: string) => {
  localFilePath = ompatiblePath(localFilePath);
  const spinner = ora({
    text: chalk.yellowBright('正在推送 nginx.conf 文件到远程服务器...')
  }).start();
  try {
    // 推送本地文件到远程服务器
    await ssh.putFile(localFilePath, remoteFilePath);
    spinner.succeed(chalk.greenBright(`服务器 ${chalk.cyan(`${remoteFilePath}`)} 内容更新成功`));
  } catch (error) {
    spinner.fail(chalk.redBright(`推送 nginx.conf 文件到服务器失败: ${error}`));
    process.exit(0);
  }
};

const onPushConfig = async ({
  host,
  port,
  username,
  password,
  nginxRemoteFilePath,
  nginxRestartPath
}: Pick<Options, 'host' | 'port' | 'username' | 'password'> & {
  nginxRemoteFilePath: string;
  nginxRestartPath: string;
}) => {
  try {
    await onCheckNginxConfigLocal();
    await onConnectServer({ host, port, username, password, ssh });
    await checkFileExistence(`${nginxRemoteFilePath}/nginx.conf`, ssh);
    await onBackupNginxConfig(`${nginxRemoteFilePath}`);
    await onPutNginxConfig(`${process.cwd()}/nginx.conf`, `${nginxRemoteFilePath}/nginx.conf`);
    await onRestartNginx(`${nginxRemoteFilePath}/nginx.conf`, nginxRestartPath, ssh);
    await onRemoveServerFile(`${nginxRemoteFilePath}/nginx_copy.conf`, ssh);
  } catch (error) {
    console.log(beautyLog.error, chalk.red(`拉取配置文件失败: ${error}`));
  } finally {
    ssh.dispose();
  }
};

export const push = async (projectName: string, option: CollectInfoParams) => {
  const {
    host: _host,
    port: _port,
    username: _username,
    password: _password,
    nginxRemoteFilePath: _nginxRemoteFilePath,
    nginxRestartPath: _nginxRestartPath
  } = option;

  const publishConfig: PublishConfigParams = getPublishConfig();

  const result = await onCollectServerInfo({
    host: _host,
    port: _port,
    username: _username,
    password: _password,
    publishConfig,
    command: 'push',
    nginxRemoteFilePath: _nginxRemoteFilePath,
    nginxRestartPath: _nginxRestartPath
  });

  const { host, port, username, password, nginxRemoteFilePath, nginxRestartPath } = result;

  await onPushConfig({
    host: host || _host || publishConfig?.serverInfo?.host,
    port: port || _port || publishConfig?.serverInfo?.port,
    username: username || _username || publishConfig?.serverInfo?.username,
    password: password || _password,
    nginxRemoteFilePath: nginxRemoteFilePath || _nginxRemoteFilePath || publishConfig?.nginxInfo?.remoteFilePath,
    nginxRestartPath: nginxRestartPath || _nginxRestartPath || publishConfig?.nginxInfo?.restartPath
  });
};
