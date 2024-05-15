### antd 按需加载

如果项目使用的是 typescript，那么在 webpack 配置中，需要把 antd 按需加载的设置写在编译 ts 中的 `babel-loader` 之下，不能写在编译 js 文件的 `babel-loader` 之下，否则将不生效，具体配置如下：

```js
module: {
  rules: [
    {
      test: /\.js(x?)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react", "mobx"],
            plugins: [
              "@babel/plugin-transform-runtime",
              "@babel/plugin-proposal-class-properties",
            ],
          },
        },
      ],
    },
    {
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "babel-loader",
          options: {
            plugins: [
              [
                "import",
                {
                  libraryName: "antd",
                  libraryDirectory: "es",
                  style: true,
                },
              ],
            ],
          },
        },
        "ts-loader",
      ],
    },
  ],
},
```

### 解决开启 css 模块化导致 antd 自定义主题失效的问题

解决这个问题需要在 webpack 中配置两次 `less-loader`，在未开启 css 模块化的 less-loader 中设置 antd 自定义主题的配置，在未设置 antd 自定义主题的 less-loader 中开启 css 模块化，具体配置如下：

```js
module: {
  rules: [
    /**
     * 使用两次less-loader解决开启css模块化时导致antd自定义主题失效的问题。
     * 需要在不开启模块化时，设置antd自定义主题才会生效，因此这一个less-loader使用include针对node_modules中的组件库（即antd）在不开启css块化的情况下，开启自定义主题的设置。
     *
     */
    {
      test: /\.less$/,
      include: [/node_modules/],
      use: [
        "style-loader",
        "css-loader",
        "postcss-loader",
        {
          loader: "less-loader",
          options: {
            lessOptions: {
              // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
              sourceMap: true,
              modifyVars: {
                "primary-color": "#1DA57A",
                "link-color": "#1DA57A",
                "border-radius-base": "2px",
              },
              javascriptEnabled: true,
            },
          },
        },
      ],
    },
    /**
     * 该less-loader使用exclude排除node_modules中的组件库，只针对自己的代码开启css模块化
     */
    {
      test: /\.less$/,
      exclude: [/node_modules/],
      use: [
        "style-loader",
        // 配置less模块化导入
        {
          loader: "css-loader",
          options: {
            modules: {
              localIdentName: "[name]__[local]--[hash:base64:5]",
            },
            importLoaders: 1,
          },
        },
        "postcss-loader",
        "less-loader",
      ],
    },
  ],
},
```

### 防止 browserRouter 路由模式出现 404

需要在 webpack 中的 `devServer` 中配置如下属性：

```js
historyApiFallback: true,
```

### 解决页面切到子路由时出现找不到 js 资源的报错

要防止刷新页面后出现页面丢失报：`GET http://localhost:9000/home/js/bundle.js net::ERR_ABORTED 404 (Not Found)`，需要在 `output` 中增加 `publicPath` 属性，配置如下：

```js
output: {
  filename: "js/[name]-bundle-[hash:6].js",
  path: path.resolve(__dirname, "../dist"),
  publicPath: "/",
},
```

### 解决 eslint 与 Prettier 之间的冲突

首先安装如下插件：

```
yarn add eslint-config-prettier eslint-plugin-prettier -D
```

之后在 `.eslintrc.js` 中修改如下配置：

```js
{
  // ...
 - "extends": ["eslint:recommended", "standard"]
 + "extends": ["eslint:recommended", "standard",  "plugin:prettier/recommended"]
  // ...
}
```

### 解决路径别名 eslint 报错

首先安装如下插件：

```js
yarn add eslint-import-resolver-webpack -D
```

增加一个与 rules 配置同级的 settings 配置：

```json
"import/resolver": {
  "webpack": {
    "config": "./config/webpack.common.config.js"
  }
}
```

### 配置 husky

首先需要安装 husky：

```js
yarn add husky -D
```

之后执行如下命令生成 `.husky` 文件，并在该文件夹下生成 `pre-commit` 文件：

```js
npm set-script prepare "husky install"

npm run prepare

npx husky add .husky/pre-commit "npm test"
```

> 注意：执行 npm set-script prepare "husky install" 之前，必须要先使用 git init 创建 .git 文件，否则将会执行失败。

最后在 `package.json` 文件中增加如下两条脚本：

```js
{
  "scripts": {
    // ...
+   "prepare": "husky install",
+   "test": "npx eslint ./src"
  }
}
```

### npx eslint ./src

注意：如果 src 的入口文件是 `.ts | .tsx` 时，执行 `npx eslint ./src` 会出现找不到 src 文件的报错，因此在执行的时候需要加上如下后缀：

```js
npx eslint ./src --ext ts,tsx
```

配置自动修复部分 eslint 报错，只需要在上述脚本的末尾加上 `--fix` 即可：

```js
npx eslint ./src --ext ts,tsx --fix
```

### husky 执行报错处理

当使用 mac 生成 `.husky` 文件时，在 windows 上执行会报：`error: cannot spawn .husky/pre-commit: No such file or directory` 这个错误，出现这个错误的原因是因为 mac 与 windows 两者之间的换行符不同。

解决这个报错的方式是：将原有的 `.husky` 文件删除，重新执行上述命令生成。

### 处理 LF 与 CRLF 转换问题

Git 可以在你 push 时自动地把行结束符 CRLF 转换成 LF，而在 pull 代码时把 LF 转换成 CRLF。用 `core.autocrlf` 来打开此项功能，如果是在 Windows 系统上，把它设置成 `true`，这样当签出代码时，LF 会被转换成 CRLF：

```js
git config --global core.autocrlf true
```

Linux 或 Mac 系统使用 LF 作为行结束符；当一个以 CRLF 为行结束符的文件不小心被引入时你肯定想进行修正，把 `core.autocrlf` 设置成 `input` 来告诉 Git 在 push 时把 CRLF 转换成 LF，pull 时不转换：

```js
git config --global core.autocrlf input
```

在本地和代码库中都保留 LF，无论 pull 还是 push 都不变，代码库什么样，本地还是什么样子：

```js
git config --global core.autocrlf false
```
