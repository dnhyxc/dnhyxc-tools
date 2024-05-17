### [dnhyxc](https://www.npmjs.com/package/dnhyxc?activeTab=readme) 脚手架工具

dnhyxc 脚手架工具，用于快速搭建项目模板。

#### 全局安装 `dnhyxc` 使用方式

```yaml
npm install dnhyxc -g
```

运行 `dnhyxc-cli create <projectName>` 创建项目，可以加上 `-t` 参数来自定义设置模版，`-f` 参数强制覆盖本地同名项目，`-d`
参数指定项目目录。

```yaml
dnhyxc create <projectName>

  # 示例
dnhyxc create my-project
```

#### 局部安装 `dnhyxc` 使用方式

```yaml
npm install dnhyxc -D
```

运行 `npx dnhyxc create <projectName>` 创建项目，可以加上 `-t` 参数来自定义设置模版，`-f` 参数强制覆盖本地同名项目，`-d`
参数指定项目目录。

或者不使用 `npm install dnhyxc -D` 在局部安装，直接使用 `npx dnhyxc create <projectName>` 命令创建项目，此时 `npx` 会自动安装 `dnhyxc` 模块。

```yaml
npx dnhyxc create <projectName>

# 示例
npx dnhyxc create my-project
```

#### 具体命令说明

1. `dnhyxc -h` 或 `dnhyxc --help` 查看帮助。

2. `dnhyxc -v` 或 `dnhyxc --version` 查看版本。

3. `dnhyxc list` 查看所有可用模板。

4. `dnhyxc create <projectName>` 创建项目。

5. `dnhyxc create <projectName> -t <templateName>` 根据输入的模版创建项目。

6. `dnhyxc create <projectName> -f` 强制覆盖本地同名项目。

### [vite](https://www.npmjs.com/package/dnhyxc-vite-plugins) 插件

这个包主要适用于 Vue + Electron 开发时用于 Vite 项目的插件。

#### ViteElectronRuntimePlugin

ViteElectronRuntimePlugin 这个插件主要实现了主进程及 preload 代码的打包及热更新，同时监听了 electron 是否终止，从而终止对应启动的 vite 服务及 终端 node 进程。

#### ViteElectronBuildPlugin

ViteElectronBuildPlugin：这个插件主要是为了防止开发者直接进行打包，而没有先使用 npm run dev 先在根目录下生成 dist 打包文件夹，从而导致 electron 打包报错。

#### 具体使用方法

首先通过 `npm i dnhyxc-vite-plugins -D` 安装插件。然后在 `vite.config.ts` 文件中引入插件，具体如下：

```js
import { defineConfig } from 'vite';
import { ViteElectronBuildPlugin, ViteElectronRuntimePlugin } from 'dnhyxc-vite-plugins';

export default defineConfig({
  plugins: [ViteElectronRuntimePlugin(), ViteElectronBuildPlugin()]
});
```
