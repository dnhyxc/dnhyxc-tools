/*
 * @Description: 开发配置
 * @Author: dnh
 * @Date: 2022-06-10 15:14:12
 * @LastEditors: dnh
 * @FilePath: \example\react\mobx\config\webpack.dev.config.js
 * @LastEditTime: 2022-06-10 19:23:53
 */
const path = require("path");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const common = require("./webpack.common.config");

module.exports = merge(common, {
  mode: "development",
  output: {
    filename: "js/[name]-bundle-[hash:6].js",
    path: path.resolve(__dirname, "../dist"),
    // 防止刷新页面后出现页面丢失报错！GET http://localhost:9000/home/js/bundle.js net::ERR_ABORTED 404 (Not Found)
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      /**
       * 使用两次 less-loader 解决开启 css 模块化时导致antd自定义主题失效的问题。
       * 需要在不开启模块化时，设置 antd 自定义主题才会生效，因此这一个 less-loader 使用 include 针对 node_modules 中的组件库（即 antd ）在不开启 css 模块化的情况下，开启自定义主题的设置。
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
                // 如果使用 less-loader@5，需要移除 lessOptions 这一级直接配置选项。
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
       * 该 less-loader 使用 exclude 排除 node_modules 中的组件库，只针对自己的代码开启 css 模块化
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
      {
        test: /\.s[ac]ss$/,
        use: [
          "style-loader",
          // 配置scss模块化导入
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: "local",
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
              importLoaders: 1,
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      inject: "body",
      hash: false,
    }),
  ],
  /**
   * devServer 配置说明：
   *  port: 端口号
   *  compress: 为每个静态文件开启gzip压缩
   */
  devServer: {
    port: 9000,
    compress: true,
    // 设置 browserHistory 路由模式时，防止出现404的情况
    historyApiFallback: true,
    // 不将错误信息显示在浏览器中
    client: {
      overlay: false,
    },
  },
  devtool: "cheap-module-source-map",
});
