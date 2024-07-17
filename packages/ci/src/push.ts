import { NodeSSH } from 'node-ssh';
import chalk from 'chalk';
import ora from 'ora';
import {
  beautyLog,
  getPublishConfig,
  onConnectServer,
  onCollectServerInfo,
  onRemoveFile,
  verifyFile,
  onRestartNginx
} from './utils';
import { Options, PublishConfigParams } from './typings';

const ssh = new NodeSSH();

// 读取本地 nginx 配置并推送到远程服务器
const onPutNginxConfig = async (localFilePath: string, publishConfig: PublishConfigParams) => {
  const spinner = ora({
    text: chalk.yellowBright('正在推送 nginx.conf 文件到远程服务器')
  }).start();
  try {
    const { restartPath, remoteFilePath } = publishConfig.nginxInfo;
    await ssh.putFile(localFilePath, remoteFilePath);
    spinner.succeed(chalk.greenBright(`成功推送 nginx.conf 文件到服务器: ${chalk.cyan(`${restartPath}`)}`));
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
  publishConfig
}: Pick<Options, 'host' | 'port' | 'username' | 'password'> & { publishConfig: PublishConfigParams }) => {
  try {
    await onConnectServer({ host, port, username, password, ssh });
    await onPutNginxConfig(`${process.cwd()}/nginx.conf`, publishConfig);
    await onRemoveFile(`${process.cwd()}/nginx.conf`);
    await onRestartNginx(publishConfig, ssh);
  } catch (error) {
    console.log(beautyLog.error, chalk.red(`拉取配置文件失败: ${error}`));
  } finally {
    ssh.dispose();
  }
};

export const push = async (projectName: string, option: Options) => {
  const { host: _host, port: _port, username: _username, password: _password } = option;

  const publishConfig = getPublishConfig();

  if (!publishConfig?.nginxInfo || !publishConfig?.nginxInfo?.restartPath) {
    console.log(
      beautyLog.warning,
      chalk.yellowBright(`请先在 ${chalk.cyan('publish.config.js')} 文件中配置 nginxInfo 相关信息`)
    );
    process.exit(0);
  }

  if (!verifyFile(`${process.cwd()}/nginx.conf`)) {
    console.log(
      '\n' + beautyLog.warning,
      chalk.yellowBright(`nginx.conf 文件不存在, 请先通过 ${chalk.cyan('dnhyxc-cli pull')} 拉取配置文件 \n`)
    );
    process.exit(0);
  }

  const result = await onCollectServerInfo({
    host: _host,
    port: _port,
    username: _username,
    password: _password,
    publishConfig
  });

  const { host, port, username, password } = result;

  await onPushConfig({
    host: host || _host || publishConfig?.serverInfo?.host,
    port: port || _port || publishConfig?.serverInfo?.port,
    username: username || _username || publishConfig?.serverInfo?.username,
    password: password || _password,
    publishConfig
  });
};
