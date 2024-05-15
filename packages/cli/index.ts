#!/usr/bin/env node

import { program } from 'commander'; // 解析命令行参
import chalk from 'chalk'; // 终端标题美化
import { logs } from '@/utils';
import { init } from '@/init';
import pkg from './package.json';

interface Options {
  template: string;
  force: string;
}

program.version(pkg.version, '-v, --version');

program
  .name("cli")
  .description("自定义脚手架")
  .usage("<command> [options]")
  .on('--help', () => {
    console.log(`\r\nRun ${ chalk.cyan(`cli <command> --help`) } for detailed usage of given command\r\n`);
  });

// program create 创建项目回调
const programCreateCallback = async (name: string, option: Options) => {
  const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  // 验证name输入是否合法
  if (pattern.test(name)) {
    console.log(logs.error, "项目名称存在非法字符，请重新输入");
    return;
  }
  await init(name, option);
};

program
  .command('create <app-name>')
  .description('创建新项目')
  .option('-t, --template [template]', '输入模板名称创建项目')
  .option('-f, --force', '强制覆盖本地同名项目')
  .option('-i, --ignore', '忽略项目相关描述,快速创建项目')
  .action(programCreateCallback);

// 必须写在所有的 program 语句之后，否则上述 program 语句不会执行
program.parse(process.argv);