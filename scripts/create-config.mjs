import path from 'path';
import fs from 'fs';
import { getPath } from '../utils/index.mjs'

/**
 * 需要处理的文件：
 *  - packages/
 *  - scripts/build-config.mjs
 *  - tsconfig.json
 */

const [, , ...args] = process.argv;

const packagesPath = getPath('../packages');
const templatePath = getPath('../template');
const buildConfigPath = getPath('../scripts/build-config.mjs');
const tsConfigPath = getPath('../tsconfig.json');
const rollupConfigPath = getPath('../template/rollup.config.js');
const vitestConfigPath = getPath('../template/vitest.config.js');

console.log(rollupConfigPath, 'rollupConfigPath')
console.log(vitestConfigPath, 'vitestConfigPath')

const checkProjectName = (projectName) => {
  const res = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(projectName);
  return res;
};

const copyFileSync = ({ templatePath, projectPath, projectName }) => {
  const stats = fs.statSync(templatePath);

  // 判断是否是文件夹
  if (stats.isDirectory()) {
    // 递归创建 packagesPath 的子目录和文件
    fs.mkdirSync(projectPath, { recursive: true });
    for (const file of fs.readdirSync(templatePath)) {
      copyFileSync({
        templatePath: path.resolve(templatePath, file),
        projectPath: path.resolve(projectPath, file),
        projectName
      });
    }
    return;
  }

  if (path.basename(templatePath) === 'package.json') {
    const pkg = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
    pkg.name = `dnhyxc-${projectName}`;
    fs.writeFileSync(projectPath, JSON.stringify(pkg, null, 2) + '\n');
    return;
  }
  fs.copyFileSync(templatePath, projectPath);
}

// 更新 build-config.mjs
const updateBuildConfig = (buildConfigPath, projectName) => {
  const config = fs.readFileSync(buildConfigPath, 'utf-8');
  const modifiedConfig = config.replace(/alias\(\{([\s\S]*?)entries:\s*\[([\s\S]*?)\]\s*\}\)/, (match, p1, p2) => {
    const entries = `\n            { find: '@', replacement: '../packages/${projectName}/src' }, ${p2}`;
    return `alias({${p1}entries: [${entries}]})`;
  });
  // fs.writeFileSync(buildConfigPath, modifiedConfig);
}

// 更新 tsconfig.json
const updateTsConfig = (tsConfigPath, projectName) => {
  let config = fs.readFileSync(tsConfigPath, 'utf-8');

  const includeRegex = /"include":\s*\[([\s\S]*?)\]/;
  const includeMatch = includeRegex.exec(config);
  if (includeMatch) {
    const includeValue = includeMatch[1];
    const modifiedIncludeValue = `"./packages/${projectName}/src/*", 
    "./packages/${projectName}/index.ts", ${includeValue}`;
    const modifiedConfig = config.replace(includeRegex, `"include": [${modifiedIncludeValue}]`);

    // 匹配 "@/*" 的值
    const atPathsRegex = /"@\/\*": \[\s*(.*?)\]/s;
    const atPathsMatch = atPathsRegex.exec(modifiedConfig);

    if (atPathsMatch) {
      const atPathsValue = atPathsMatch[1];
      const modifiedAtPathsValue = `"./packages/${projectName}/src/*", ${atPathsValue}`;

      // 替换原始的 "@/*" 值
      const modifiedConfigString = modifiedConfig.replace(atPathsRegex, `"@/*": [${modifiedAtPathsValue}]`);
      console.log(modifiedConfigString);
      // fs.writeFileSync(tsConfigPath, modifiedConfigString);
    }
  }
}

const create = async ({ templatePath, packagesPath, projectName }) => {
  const projectPath = getPath(`${packagesPath}/${projectName}`)

  if (!checkProjectName(projectName)) {
    console.log('项目名称存在非法字符，请重新输入');
    return;
  }

  if (fs.existsSync(projectPath)) {
    console.log(`已有 ${projectName} 项目，请勿重复创建！`);
    return;
  }

  copyFileSync({ templatePath, projectPath, projectName })
  updateBuildConfig(buildConfigPath, projectName)
  updateTsConfig(tsConfigPath, projectName)
}

create({ templatePath, packagesPath, projectName: args[0] })