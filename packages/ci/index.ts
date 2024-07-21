#!/usr/bin/env node

import { program } from 'commander'; // 解析命令行参
import chalk from 'chalk'; // 终端标题美化
import { updateVersion, beautyLog, isValidFilePath } from '@ci/utils';
import { publish } from '@ci/publish';
import { pull } from '@ci/pull';
import { push } from '@ci/push';
import { restart } from '@ci/restart';
import { CollectInfoParams, Options } from '@ci/types';
import pkg from './package.json';

program.version(updateVersion(pkg.version), '-v, --version');

program
  .name('dnhyxc-ci')
  .description('自动部署工具')
  .usage('<command> [options]')
  .on('--help', () => {
    console.log(`\r\nRun ${chalk.cyan('dnhyxc-ci <command> --help')} for detailed usage of given command\r\n`);
  });

const publishCallback = async (name: string, options: Options) => {
  await publish(name, options);
};

const pullNginxConfCallback = async (name: string, option: Options & CollectInfoParams) => {
  await pull(name, option);
};

const pushNginxConfCallback = async (name: string, option: Options & CollectInfoParams) => {
  await push(name, option);
};

const restartCallback = async (name: string, option: Options & CollectInfoParams) => {
  await restart(name, option);
};

const validateServiceName = (serviceName: string) => {
  if (serviceName !== 'nginx' && serviceName !== 'node') {
    console.log(
      '\n' + beautyLog.warning,
      chalk.yellowBright(`Error: serviceName must be ${chalk.cyan('nginx')} or ${chalk.cyan('node')}\n`)
    );
    process.exit(1);
  }
  return serviceName;
};

program
  .command('publish <name>')
  .description('项目部署')
  .option('-h, --host [host]', '输入host')
  .option('-p, --port [port]', '输入端口号')
  .option('-u, --username [username]', '输入用户名')
  .option('-m, --password [password]', '输入密码')
  .option('-l, --lcalFilePath [lcalFilePath]', '输入本地文件路径')
  .option('-r, --remoteFilePath [remoteFilePath]', '输入服务器目标文件路径')
  .option('-s, --isServer', '是否是 node 服务端项目')
  .option('-i, --install', '是否需要安装依赖')
  .action((name, option) => {
    if (option?.lcalFilePath && !isValidFilePath(option?.lcalFilePath)) {
      console.log(`\n${chalk.redBright('Error: 本地文件路径必须以 / 开头')}\n`);
      process.exit(1);
    }
    if (option?.remoteFilePath && !isValidFilePath(option?.remoteFilePath)) {
      console.log(`\n${chalk.redBright('Error: 服务器目标文件路径必须以 / 开头')}\n`);
      process.exit(1);
    }
    publishCallback(name, option);
  });

program
  .command('pull [configName]')
  .description('获取 nginx.conf 配置文件到本地')
  .option('-h, --host [host]', '输入host')
  .option('-p, --port [port]', '输入端口号')
  .option('-u, --username [username]', '输入用户名')
  .option('-m, --password [password]', '输入密码')
  .option('-ncp, --nginxRemoteFilePath [nginxRemoteFilePath]', '输入服务器 nginx.conf 文件路径')
  .action((configName, option) => {
    if (option?.nginxRemoteFilePath && !isValidFilePath(option?.nginxRemoteFilePath)) {
      console.log(`\n${chalk.redBright('Error: nginx.conf 文件路径必须以 / 开头')}\n`);
      process.exit(1);
    }
    pullNginxConfCallback(configName, option);
  });

program
  .command('push [configName]')
  .description('发布 nginx.conf 配置到服务器')
  .option('-h, --host [host]', '输入host')
  .option('-p, --port [port]', '输入端口号')
  .option('-u, --username [username]', '输入用户名')
  .option('-m, --password [password]', '输入密码')
  .option('-ncp, --nginxRemoteFilePath [nginxRemoteFilePath]', '输入服务器 nginx.conf 文件路径')
  .option('-nrp, --nginxRestartPath [nginxRestartPath]', '输入服务器 nginx 重启路径')
  .action((configName, option) => {
    if (option?.nginxRemoteFilePath && !isValidFilePath(option?.nginxRemoteFilePath)) {
      console.log(`\n${chalk.redBright('Error: nginx.conf 文件路径必须以 / 开头')}\n`);
      process.exit(1);
    }
    if (option?.nginxRestartPath && !isValidFilePath(option?.nginxRestartPath)) {
      console.log(`\n${chalk.redBright('Error: nginx 重启路径必须以 / 开头')}\n`);
      process.exit(1);
    }
    pushNginxConfCallback(configName, option);
  });

program
  .command('restart <serviceName>')
  .description('重启 nginx 或者 node 服务')
  .option('-h, --host [host]', '输入host')
  .option('-p, --port [port]', '输入端口号')
  .option('-u, --username [username]', '输入用户名')
  .option('-m, --password [password]', '输入密码')
  .option('-ncp, --nginxRemoteFilePath [nginxRemoteFilePath]', '输入服务器 nginx.conf 文件路径')
  .option('-nrp, --nginxRestartPath [nginxRestartPath]', '输入服务器 nginx 重启路径')
  .option('-srp, --serviceRestartPath [serviceRestartPath]', '输入服务器 node 重启路径')
  .action((serviceName, option) => {
    const validatedServiceName = validateServiceName(serviceName);
    if (option?.nginxRemoteFilePath && !isValidFilePath(option?.nginxRemoteFilePath)) {
      console.log(`\n${chalk.redBright('Error: nginx.conf 文件路径必须以 / 开头')}\n`);
      process.exit(1);
    }
    if (option?.nginxRestartPath && !isValidFilePath(option?.nginxRestartPath)) {
      console.log(`\n${chalk.redBright('Error: nginx 重启路径必须以 / 开头')}\n`);
      process.exit(1);
    }
    if (option?.serviceRestartPath && !isValidFilePath(option?.serviceRestartPath)) {
      console.log(`\n${chalk.redBright('Error: node 重启路径必须以 / 开头')}\n`);
      process.exit(1);
    }
    restartCallback(validatedServiceName, option);
  });

// 必须写在所有的 program 语句之后，否则上述 program 语句不会执行
program.parse(process.argv);
