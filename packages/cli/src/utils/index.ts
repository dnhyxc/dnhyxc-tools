import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import chalk from 'chalk';

export { logs } from './logs';

type DeepMergeParams = {
  [key: string]: any;
};

const isObject = (val: object) => val && typeof val === 'object';
const mergeArrayWithDedupe = (a: string[], b: string[]) => Array.from(new Set([...a, ...b]));

// 深度合并 package
export const deepMergePkg = (target: DeepMergeParams, obj: DeepMergeParams) => {
  for (const key of Object.keys(obj)) {
    const oldVal = target[key as any];
    const newVal = obj[key as any];
    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      target[key] = mergeArrayWithDedupe(oldVal, newVal);
    } else if (isObject(oldVal) && isObject(newVal)) {
      target[key] = deepMergePkg(oldVal, newVal);
    } else {
      target[key] = newVal;
    }
  }
  return target;
};

// package 排序
export const dependenciesSort = (packageJson: DeepMergeParams) => {
  const DEP_TYPES = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  const sorted: DeepMergeParams = {};
  for (const type of DEP_TYPES) {
    if (packageJson[type]) {
      sorted[type] = {};
      Object.keys(packageJson[type])
        .sort()
        .forEach((name) => {
          sorted[type][name] = packageJson[type][name];
        });
    }
  }

  return {
    ...packageJson,
    ...sorted
  };
};

// 获取执行脚本
export const getExecScript = (projectPath: string) => {
  // 检查 package-lock.json 是否存在
  const packageLockPath = path.join(projectPath, 'package-lock.json');
  const pnpmLockPath = path.join(projectPath, 'pnpm-lock.yaml');
  const yarnLockPath = path.join(projectPath, 'yarn.lock');

  const hasPackageLock = fs.existsSync(packageLockPath);
  const hasPnpmLock = fs.existsSync(pnpmLockPath);
  const hasYarnLock = fs.existsSync(yarnLockPath);

  if (hasPackageLock && hasPnpmLock && !hasYarnLock) {
    // 如果同时存在 package-lock.json 和 pnpm-lock.yaml，并且不存在 yarn.lock，优先使用 pnpm-lock.yaml
    return 'pnpm install';
  } else if (hasPackageLock && !hasPnpmLock && hasYarnLock) {
    // 如果同时存在 package-lock.json 和 yarn.lock，并且不存在 pnpm-lock.yaml，优先使用 yarn.lock
    return 'yarn';
  } else if (!hasPackageLock && hasPnpmLock && hasYarnLock) {
    // 如果同时存在 pnpm-lock.yaml 和 yarn.lock，并且不存在 package-lock.json，优先使用 pnpm-lock.yaml
    return 'pnpm install';
  } else if (hasPackageLock && !hasPnpmLock && !hasYarnLock) {
    // 只存在 package-lock.json，使用 npm
    return 'npm install';
  } else if (!hasPackageLock && hasPnpmLock && !hasYarnLock) {
    // 只存在 pnpm-lock.yaml，使用 pnpm
    return 'pnpm install';
  } else if (!hasPackageLock && !hasPnpmLock && hasYarnLock) {
    // 只存在 yarn.lock，使用 yarn
    return 'yarn';
  } else {
    // 既没有 package-lock.json，也没有 pnpm-lock.yaml，也没有 yarn.lock，默认使用 npm
    return 'npm install';
  }
};

// 删除指定文件夹
export const removeDir = async (dir: string) => {
  const spinner = ora({
    text: chalk.yellowBright(`正在删除文件夹: ${ chalk.cyan(dir) }`),
  }).start();

  try {
    await fs.remove(dir);
    spinner.succeed(chalk.greenBright(`删除文件夹: ${ chalk.cyan(dir) } 成功`));
  } catch (err) {
    console.log(err);
    spinner.fail(chalk.redBright(`删除文件夹: ${ chalk.cyan(dir) } 失败`));
  }
};

export const verifyDir = (dir: string) => {
  return fs.existsSync(dir);
};
