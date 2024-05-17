import path from 'path';
import fs from 'fs';
import { PKG } from '@/constants';
import { deepMergePkg, dependenciesSort, verifyFile } from '@/utils';

interface RenderTemplateParams {
  templateDir: string;
  projectPath: string;
  projectName: string;
  callback: (params: { pkg: { [key: string]: string } }) => void;
}

export const renderTemplate = ({ templateDir, projectPath, projectName, callback }: RenderTemplateParams) => {
  const stats = fs.statSync(templateDir);

  // 判断是否是文件夹
  if (stats.isDirectory()) {
    // 如果是 node_modules 不创建
    if (path.basename(templateDir) === 'node_modules') return;

    // 递归创建 dest 的子目录和文件
    fs.mkdirSync(projectPath, { recursive: true });
    for (const file of fs.readdirSync(templateDir)) {
      renderTemplate({
        templateDir: path.resolve(templateDir, file),
        projectPath: path.resolve(projectPath, file),
        projectName,
        callback
      });
    }
    return;
  }

  if (path.basename(templateDir) === PKG && verifyFile(projectPath)) {
    // 已经设置好的 package 内容
    const existedPackage = JSON.parse(fs.readFileSync(projectPath, 'utf8'));
    // 需要合并进入的新的 package 内容
    const newPackage = JSON.parse(fs.readFileSync(templateDir, 'utf8'));
    // deepMerge 重新给 package.json 赋值，并且进行排序
    const pkg = dependenciesSort(deepMergePkg(existedPackage, newPackage));
    pkg.name = projectName;
    pkg.version = '0.0.0';
    callback({ pkg });
    fs.writeFileSync(projectPath, JSON.stringify(pkg, null, 2) + '\n');
    return;
  }

  fs.copyFileSync(templateDir, projectPath);
};
