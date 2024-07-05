#!/usr/bin/env node

import chalk from 'chalk';
import { program } from 'commander';
import { Options, init } from '@/init';
import { templates } from '@/constants';
import { logs, checkProjectName, updateVersion } from './src/utils';
import pkg from './package.json';

program.version(updateVersion(pkg.version), '-v, --version');

program
  .name('dnhyxc')
  .description('自定义脚手架')
  .usage('<command> [options]')
  .on('--help', () => {
    console.log(`\r\nRun ${chalk.cyan('dnhyxc <command> --help')} for detailed usage of given command\r\n`);
  });

program
  .command('list')
  .description('查看所有可用模板')
  .action(async () => {
    console.log(chalk.yellowBright(logs.star, '模板列表'));
    templates.forEach((project, index) => {
      console.log(logs.info, chalk.green(`(${index + 1}) <${project.name}>`), chalk.gray(`${project.desc}`));
    });
  });

const programCreateCallback = async (name: string, option: Options) => {
  if (!checkProjectName(name)) {
    console.log(logs.error, '项目名称存在非法字符，请重新输入');
    return;
  }
  // init 方法初始化项目
  await init(name, option);
};

program
  .command('create <app-name>')
  .description('创建新项目')
  .option('-t, --template [template]', '输入模板名称创建项目')
  .option('-f, --force', '强制覆盖本地同名项目')
  .action(programCreateCallback);

program.parse(process.argv);
