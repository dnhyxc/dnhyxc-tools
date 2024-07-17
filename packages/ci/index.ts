#!/usr/bin/env node

import { program } from 'commander'; // 解析命令行参
import chalk from 'chalk'; // 终端标题美化
import { updateVersion, beautyLog } from '@ci/utils';
import { publish } from '@ci/publish';
import { pull } from '@ci/pull';
import { push } from '@ci/push';
import { restart } from '@ci/restart';
import { Options } from '@ci/typings';
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

const pullNginxConfCallback = async (name: string, option: Options) => {
  await pull(name, option);
};

const pushNginxConfCallback = async (name: string, option: Options) => {
  await push(name, option);
};

const restartCallback = async (name: string, option: Options) => {
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
  .option('-i, --install', '是否需要安装依赖')
  .action(publishCallback);

program
  .command('pull [configName]')
  .description('获取 nginx.conf 配置')
  .option('-h, --host [host]', '输入host')
  .option('-p, --port [port]', '输入端口号')
  .option('-u, --username [username]', '输入用户名')
  .option('-m, --password [password]', '输入密码')
  .action(pullNginxConfCallback);

program
  .command('push [configName]')
  .description('发布 nginx.conf 配置')
  .option('-h, --host [host]', '输入host')
  .option('-p, --port [port]', '输入端口号')
  .option('-u, --username [username]', '输入用户名')
  .option('-m, --password [password]', '输入密码')
  .action(pushNginxConfCallback);

program
  .command('restart <serviceName>')
  .description('重启 nginx 或者 node 服务')
  .option('-h, --host [host]', '输入host')
  .option('-p, --port [port]', '输入端口号')
  .option('-u, --username [username]', '输入用户名')
  .option('-m, --password [password]', '输入密码')
  .action((serviceName, option) => {
    const validatedServiceName = validateServiceName(serviceName);
    restartCallback(validatedServiceName, option);
  });

// 必须写在所有的 program 语句之后，否则上述 program 语句不会执行
program.parse(process.argv);
