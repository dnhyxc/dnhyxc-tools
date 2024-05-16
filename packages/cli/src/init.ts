import path from 'path';
import fs from 'fs';
import prompts from 'prompts';
import { verifyDir, removeDir } from '@/utils';
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
  needsInstall: boolean;
}

interface Pkg {
  [key: string]: any;
}

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
          type: () => (!verifyDir(projectPath) || force ? null : 'toggle'),
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

  const { needsOverwrite, restoreProjectName, needsTypeScript, needsMbox, needsEslint, needsInstall } = result;

  // 重新设置项目名称及路径
  if (restoreProjectName) {
    projectName = restoreProjectName;
    projectPath = path.join(process.cwd(), projectName);
  }

  if (!needsOverwrite && fs.existsSync(projectPath)) {
    await removeDir(projectPath);
  }

  if (needsOverwrite && !restoreProjectName.trim()) {
    console.log('项目名称冲突或有误，请修改项目名称后再试');
    return;
  }

  let newPkg: Pkg | null = null;

  const callback = (values: { pkg: Pkg }) => {
    newPkg = values.pkg;
  };

  const render = (templateName: string) => {
    const templateDir = path.resolve(__dirname, `./src/template/${templateName}`);
    renderTemplate({ templateDir, projectPath, projectName, callback });
  };

  // 取反表示选择的是 yes
  if ((!needsTypeScript && !template) || template === 'typescript') {
    render('typescript');
  } else {
    render('base');
  }

  // 取反表示选择的是 yes
  if (!needsMbox) {
    // 判断是否使用ts
    if (!needsTypeScript) {
      render('config/mbox-ts');
    } else {
      render('config/mbox-js');
    }
  }

  if (!needsEslint) {
    render('config/eslint');
  }

  if (!needsInstall) {
    await install(projectPath, projectName, newPkg as unknown as Pkg);
  } else {
    manualInstall(projectPath, projectName, newPkg as unknown as Pkg);
  }
};
