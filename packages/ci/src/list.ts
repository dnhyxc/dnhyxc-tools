import { NodeSSH } from 'node-ssh';
import chalk from 'chalk';
import { beautyLog, getPublishConfig, onConnectServer, onCollectServerInfo } from './utils';
import { Options } from './types';

const ssh = new NodeSSH();

// 查看 node 服务相关进程的状态和日志信息
const onViewNodeProcess = async () => {
  try {
    const { code, stdout, stderr } = await ssh.execCommand('pm2 list');
    if (code === 0) {
      console.log(
        `\n${beautyLog.success}`,
        chalk.greenBright(`查看 node 服务相关进程的状态和日志信息成功: ${chalk.bold(`\n${stdout}\n`)}`)
      );
    } else {
      console.log(chalk.redBright(`查看 node 服务相关进程的状态和日志信息成功失败: ${stderr}`));
      process.exit(1);
    }
  } catch (error) {
    console.log(beautyLog.error, chalk.red(`运行 pm2 list 命令失败: ${error}`));
  }
};

const onRunList = async ({
  host,
  port,
  username,
  password
}: Pick<Options, 'host' | 'port' | 'username' | 'password'>) => {
  try {
    await onConnectServer({ host, port, username, password, ssh });
    await onViewNodeProcess();
  } catch (error) {
    console.log(beautyLog.error, chalk.red(`查看 node 服务相关进程的状态和日志信息失败: ${error}`));
  } finally {
    ssh.dispose();
  }
};

export const list = async (option: Pick<Options, 'host' | 'port' | 'username' | 'password'>) => {
  const { host: _host, port: _port, username: _username, password: _password } = option;

  const publishConfig = getPublishConfig();

  const result = await onCollectServerInfo({
    host: _host,
    port: _port,
    username: _username,
    password: _password,
    publishConfig
  });

  const { host, port, username, password } = result;

  await onRunList({
    host: host || _host || publishConfig?.serverInfo?.host,
    port: port || _port || publishConfig?.serverInfo?.port,
    username: username || _username || publishConfig?.serverInfo?.username,
    password: password || _password
  });
};
