import fs from 'fs-extra';
import { NodeSSH } from 'node-ssh';
import chalk from 'chalk';
import ora from 'ora';
import { beautyLog, getPublishConfig, onConnectServer, onCollectServerInfo } from './utils';
import { Options, PublishConfigParams, CollectInfoParams } from './types';

const ssh = new NodeSSH();

// 读取 ngnix 配置
const onReadNginxConfig = async (remotePath: string, localFileName: string) => {
  const spinner = ora({
    text: chalk.yellowBright(`正在读取远程 ${chalk.cyan(`${remotePath}`)} 文件...`)
  }).start();
  try {
    const result = await ssh.execCommand(`cat ${remotePath}`);
    const nginxConfigContent = result.stdout;
    if (nginxConfigContent) {
      // 写入到本地文件
      await fs.writeFile(localFileName, nginxConfigContent);
      spinner.succeed(
        chalk.greenBright(`读取 nginx.conf 成功，内容已写入到本地 ${chalk.cyan(`${localFileName}`)} 文件中`)
      );
    } else {
      spinner.fail(chalk.redBright(`读取 nginx.conf 失败，远程文件 ${chalk.cyan(`${remotePath}`)} 内容为空`));
      process.exit(1);
    }
  } catch (err) {
    spinner.fail(chalk.redBright(`读取: ${chalk.cyan(`${remotePath}`)} 文件失败，${err}`));
  }
};

const onPullConfig = async ({
  host,
  port,
  username,
  password,
  nginxRemoteFilePath
}: Pick<Options, 'host' | 'port' | 'username' | 'password'> & { nginxRemoteFilePath: string }) => {
  try {
    await onConnectServer({ host, port, username, password, ssh });
    await onReadNginxConfig(`${nginxRemoteFilePath}/nginx.conf`, `${process.cwd()}/nginx.conf`);
  } catch (error) {
    console.log(beautyLog.error, chalk.red(`拉取配置文件失败: ${error}`));
  } finally {
    ssh.dispose();
  }
};

export const pull = async (projectName: string, option: CollectInfoParams) => {
  const {
    host: _host,
    port: _port,
    username: _username,
    password: _password,
    nginxRemoteFilePath: _nginxRemoteFilePath
  } = option;

  const publishConfig: PublishConfigParams = getPublishConfig();

  // 获取收集的服务器信息
  const result = await onCollectServerInfo({
    host: _host,
    port: _port,
    username: _username,
    password: _password,
    publishConfig,
    command: 'pull',
    nginxRemoteFilePath: _nginxRemoteFilePath
  });

  const { host, port, username, password, nginxRemoteFilePath } = result;

  await onPullConfig({
    host: host || _host || publishConfig?.serverInfo?.host,
    port: port || _port || publishConfig?.serverInfo?.port,
    username: username || _username || publishConfig?.serverInfo?.username,
    password: password || _password,
    nginxRemoteFilePath: nginxRemoteFilePath || _nginxRemoteFilePath || publishConfig?.nginxInfo?.remoteFilePath
  });
};
