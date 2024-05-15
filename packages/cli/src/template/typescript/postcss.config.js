/*
 * @Description: postcss 配置
 * @Author: dnh
 * @Date: 2022-06-10 16:12:17
 * @LastEditors: dnh
 * @FilePath: \example\react\mobx\postcss.config.js
 * @LastEditTime: 2022-06-10 16:13:40
 */
module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: [
        'Android 4.1',
        'iOS 7.1',
        'Chrome > 31',
        'ff > 31',
        'ie >= 8',
      ],
    }),
  ],
};
/**
 * postcss 一种对 css 编译的工具，类似 babel 对 js 的处理。
 * 
 * CSS 规则添加特定厂商的前缀。 Autoprefixer 自动获取浏览器的流行度和能够支持的属性，并根据这些数据帮你自动为 CSS 规则添加前缀。
 * postcss 只是一个工具，本身不会对 css 一顿操作，它通过插件实现功能，autoprefixer 就是其一。
 * 
 * npm install postcss postcss-loader autoprefixer --save-dev
 */

