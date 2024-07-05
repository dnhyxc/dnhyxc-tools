import fs from 'fs-extra';
import { exec } from 'child_process';
import ora from 'ora';
import chalk from 'chalk';
import { logs, getExecScript } from '../utils';

// 获取项目运行的脚本
const getScript = (projectName: string, execScript: string | null = null, pkg: { [key: string]: any }) => {
  console.log(logs.info, chalk.green(`cd ${projectName}`));
  execScript && console.log(logs.info, chalk.green(`执行 ${execScript} 下载依赖`));
  if (pkg?.scripts?.dev) {
    console.log(logs.info, chalk.green('运行 npm run dev 启动项目'));
    return;
  }
  if (pkg?.scripts?.start) {
    console.log(logs.info, chalk.green('运行 npm start 启动项目'));
    return;
  }
  if (pkg?.scripts?.serve) {
    console.log(logs.info, chalk.green('运行 npm run serve 启动项目'));
    return;
  }
  console.log(logs.info, chalk.green('按 package.json 中配置 scripts 启动项目'));
};

// 自动安装依赖
export const install = async (projectPath: string, projectName: string, pkg: { [key: string]: any }) => {
  const spinner = ora('正在下载依赖...\n').start();
  return new Promise(() => {
    const execScript = getExecScript(projectPath);
    exec(`cd ${projectPath} && ${execScript}`, (error, stdout, stderr) => {
      console.log(chalk.yellow(`${stdout}\n`));
      console.log(chalk.yellow(`${stderr}`));
      if (error) {
        const hasNode_modules = fs.existsSync(`${projectPath}/node_modules`);
        if (hasNode_modules) {
          spinner.fail(chalk.yellow(`执行${execScript}自动下载依赖存在警告或者报错，请检查项目依赖下载是否有误`));
          getScript(projectName, null, pkg);
        } else {
          console.log(logs.error, `${error.message}`);
          spinner.fail(chalk.red(`执行${execScript}自动下载依赖失败，请 cd ${projectName}，手动安装依赖`));
        }
      }
      spinner.succeed(chalk.green('依赖下载完成'));
      getScript(projectName, null, pkg);
    });
  });
};

export const manualInstall = (projectPath: string, projectName: string, pkg: { [key: string]: any }) => {
  const execScript = getExecScript(projectPath);
  getScript(projectName, execScript, pkg);
};
