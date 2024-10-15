### 初始化项目

全局依赖安装：

```yaml
pnpm i
```

为根目录安装：

```yaml
pnpm i rollup -Dw
```

为子包单独安装：

- 进入子包目录进行安装：

```yaml
cd packages/demo

pnpm i rollup -D
```

- 或者在根目录运行 `pnpm i visite --filter demo` 为指定子包安装依赖。

```yaml
pnpm i visite --filter demo
```

### 新建子包

运行 `npm run create <projectName>` 即可创建新的子包，其中 `<projectName>` 为子包名称，也就是文件夹名称。

```yaml
npm run create demo
```

子包创建完毕之后，运行 `pnpm i` 安装依赖，注意 node 是否支持 pnpm。

```yaml
pnpm i
```

上述操作完成后，可以根据自己的需求，更新 `package.json` 中的报名 `name`、`files` 等信息。

### 运行测试

进入子包，运行 `npm test` 即可运行测试。

```yaml
cd packages/demo

npm run test
```

### 打包

单独为子包打包：

```yaml
cd packages/demo

npm run build
```

打包所有子包：在根目录运行 `npm run build` 即可。

```yaml
npm run build
```

### 发布

在根目录运行 `npm run release` 即可发布所有子包。

```yaml
npm run release
```

### 快捷发布

在根目录运行 `npm run publish` 即可快捷测试、打包、发布所有子包。

```yaml
npm run publish
```

### 开发注意事项

1. node 需要使用 v18+ 的版本，否则打包会报错。

2. 如果需要在 example 中使用本地的子包，需要在 pnpm-workspace.yaml 中添加 example 项目，否则会导致 example 项目找不到本地的子包。

```yaml
packages:
  - example/
  - 'packages/**'
```

3. 采用 workspace 这种方式，example 项目可以通过 `pnpm i` 安装对应的子包，从而直接使用本地的子包，同时只要引用的子包重新 build 之后，example 项目也会自动更新，无需重复安装。

```json
{
  "dnhyxc": "workspace:^",
  "dnhyxc-ci": "workspace:^",
  "dnhyxc-vite-plugins": "workspace:^"
}
```
