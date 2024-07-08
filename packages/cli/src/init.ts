import path from 'path';
import fs from 'fs';
import prompts from 'prompts';
import chalk from 'chalk';
import { verifyFile, removeDir, logs, fileRename } from '@/utils';
import { renderTemplate } from '@/render';
import { install, manualInstall } from '@/install';

export interface Options {
  template: string;
  force: boolean;
}

interface Result {
  needsOverwrite: boolean;
  restoreProjectName: string;
  needsTypeScript: boolean;
  needsMbox: boolean;
  needsEslint: boolean;
  needsHusky: boolean;
  needsInstall: boolean;
}

// 根据收集到的信息初始化项目
export const init = async (name: string, option: Options) => {
  const { template, force } = option;

  let result = {} as Result;
  let projectName = name;
  let projectPath: string = path.join(process.cwd(), projectName);

  try {
    // no: true, yes: false
    result = await prompts(
      [
        {
          name: 'projectName',
          type: projectName ? null : 'text',
          message: '项目名称:',
          initial: projectName,
          onState: (state) => (projectName = String(state.value).trim() || 'my-project')
        },
        {
          name: 'needsOverwrite',
          type: () => (!verifyFile(projectPath) || force ? null : 'toggle'),
          message: '存在相同文件夹是否强制覆盖？',
          initial: true,
          active: 'no',
          inactive: 'yes'
        },
        {
          name: 'restoreProjectName',
          type: (prev) => (prev ? 'text' : null),
          message: '重新设置项目名称为:',
          initial: projectName + '_1',
          onState: (state) => (projectName = String(state.value).trim() || projectName + '_1')
        },
        {
          name: 'needsTypeScript',
          type: template ? null : 'toggle',
          message: '是否使用 typescript?',
          initial: false,
          active: 'no',
          inactive: 'yes'
        },
        {
          name: 'needsMbox',
          type: 'toggle',
          message: '是否使用 mbox?',
          initial: false,
          active: 'no',
          inactive: 'yes'
        },
        {
          name: 'needsEslint',
          type: 'toggle',
          message: '是否使用 eslint?',
          initial: false,
          active: 'no',
          inactive: 'yes'
        },
        {
          name: 'needsHusky',
          type: 'toggle',
          message: '是否使用 husky?',
          initial: false,
          active: 'no',
          inactive: 'yes'
        },
        {
          name: 'needsInstall',
          type: 'toggle',
          message: '是否自动安装依赖?',
          initial: false,
          active: 'no',
          inactive: 'yes'
        }
      ],
      {
        onCancel: () => {
          throw new Error('User cancelled');
        }
      }
    );
  } catch (cancelled) {
    process.exit(1);
  }

  const { needsOverwrite, restoreProjectName, needsTypeScript, needsMbox, needsEslint, needsHusky, needsInstall } =
    result;

  // 重新设置项目名称及路径
  if (restoreProjectName) {
    projectName = restoreProjectName;
    projectPath = path.join(process.cwd(), projectName);
  }

  // 项目已存在且选择强制覆盖
  if (!needsOverwrite && fs.existsSync(projectPath)) {
    await removeDir(projectPath);
  }
  // 项目已存在且未选择强制覆盖
  if (needsOverwrite && !restoreProjectName.trim()) {
    console.log(logs.info, chalk.yellowBright('项目名称冲突或有误，请修改项目名称后再试'));
    return;
  }

  // 创建项目文件夹
  const render = (templateName: string) => {
    const templateDir = path.resolve(__dirname, `./src/template/${templateName}`);
    renderTemplate({ templateDir, projectPath, projectName });
  };

  // 取反表示选择的是 yes
  if ((!needsTypeScript && !template) || template === 'typescript') {
    render('typescript');
  } else {
    render('base');
  }

  // 判断是否使用 mbox，取反表示选择的是 yes
  if (!needsMbox) {
    // 判断是否使用ts
    if (!needsTypeScript) {
      render('config/mbox-ts');
    } else {
      render('config/mbox-js');
    }
  }

  // 判断是否使用 eslint，取反表示选择的是 yes
  if (!needsEslint) {
    render('config/eslint');
  }

  // 判断是否使用 husky，取反表示选择的是 yes
  if (!needsHusky) {
    render('config/husky');
  }

  // 将pkg.json重命名为package.json
  const pkg = (await fileRename(projectPath, projectName)) as { [key: string]: any };

  // 是否自动安装依赖，取反表示选择的是 yes
  if (!needsInstall) {
    await install(projectPath, projectName, pkg);
  } else {
    manualInstall(projectPath, projectName, pkg);
  }
};
