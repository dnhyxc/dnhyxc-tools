import { NodeSSH } from 'node-ssh';
import chalk from 'chalk';
import {
  beautyLog,
  getPublishConfig,
  onConnectServer,
  onRestartNginx,
  onCollectServerInfo,
  onRestartServer
} from './utils';
import { Options, CollectInfoParams } from './types';

const ssh = new NodeSSH();

const onRestart = async ({
  host,
  port,
  username,
  password,
  projectName,
  nginxRemoteFilePath,
  nginxRestartPath,
  serviceRestartPath
}: Pick<Options, 'host' | 'port' | 'username' | 'password'> & {
  projectName: string;
  nginxRemoteFilePath: string;
  nginxRestartPath: string;
  serviceRestartPath: string;
}) => {
  try {
    await onConnectServer({ host, port, username, password, ssh });
    if (projectName === 'nginx') {
      await onRestartNginx(nginxRemoteFilePath, nginxRestartPath, ssh);
    } else if (projectName === 'node') {
      await onRestartServer(serviceRestartPath, ssh);
    } else {
      console.log(beautyLog.error, chalk.red(`暂不支持 ${projectName} 服务的重启`));
      process.exit(1);
    }
  } catch (error) {
    console.log(beautyLog.error, chalk.red(`拉取配置文件失败: ${error}`));
  } finally {
    ssh.dispose();
  }
};

export const restart = async (projectName: string, option: CollectInfoParams) => {
  const {
    host: _host,
    port: _port,
    username: _username,
    password: _password,
    nginxRemoteFilePath: _nginxRemoteFilePath,
    nginxRestartPath: _nginxRestartPath,
    serviceRestartPath: _serviceRestartPath
  } = option;

  const publishConfig = getPublishConfig();

  const result = await onCollectServerInfo({
    host: _host,
    port: _port,
    username: _username,
    password: _password,
    projectName,
    publishConfig,
    nginxRemoteFilePath: _nginxRemoteFilePath,
    nginxRestartPath: _nginxRestartPath,
    serviceRestartPath: _serviceRestartPath,
    command: 'restart'
  });

  const { host, port, username, password, nginxRemoteFilePath, nginxRestartPath, serviceRestartPath } = result;

  await onRestart({
    host: host || _host || publishConfig?.serverInfo?.host,
    port: port || _port || publishConfig?.serverInfo?.port,
    username: username || _username || publishConfig?.serverInfo?.username,
    password: password || _password,
    projectName,
    nginxRemoteFilePath: nginxRemoteFilePath || _nginxRemoteFilePath || publishConfig?.nginxInfo?.remoteFilePath,
    nginxRestartPath: nginxRestartPath || _nginxRestartPath || publishConfig?.nginxInfo?.restartPath,
    serviceRestartPath: serviceRestartPath || _serviceRestartPath || publishConfig?.serviceInfo?.restartPath
  });
};
