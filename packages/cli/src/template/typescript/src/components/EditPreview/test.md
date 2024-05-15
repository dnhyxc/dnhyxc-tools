<p>###&nbsp;antd&nbsp;按需加载</p>
<p>
  如果项目使用的是&nbsp;typescript，那么在&nbsp;webpack&nbsp;配置中，需要把&nbsp;antd&nbsp;按需加载的设置写在编译&nbsp;ts&nbsp;中的&nbsp;`babel-loader`&nbsp;之下，不能写在编译&nbsp;js&nbsp;文件的&nbsp;`babel-loader`&nbsp;之下，否则将不生效，具体配置如下：
</p>
<p>```js</p>
<p>module:&nbsp;{</p>
<p> &nbsp;rules:&nbsp;[</p>
<p> &nbsp; &nbsp;{</p>
<p> &nbsp; &nbsp; &nbsp;test:&nbsp;/\.js(x?)$/,</p>
<p> &nbsp; &nbsp; &nbsp;exclude:&nbsp;/node_modules/,</p>
<p> &nbsp; &nbsp; &nbsp;use:&nbsp;[</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp;{</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;loader:&nbsp;"babel-loader",</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;options:&nbsp;{</p>
<p>
   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;presets:&nbsp;["@babel/preset-env",&nbsp;"@babel/preset-react",&nbsp;"mobx"],
</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;plugins:&nbsp;[</p>
<p>
   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;"@babel/plugin-transform-runtime",
</p>
<p>
   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;"@babel/plugin-proposal-class-properties",
</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;],</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;},</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp;},</p>
<p> &nbsp; &nbsp; &nbsp;],</p>
<p> &nbsp; &nbsp;},</p>
<p> &nbsp; &nbsp;{</p>
<p> &nbsp; &nbsp; &nbsp;test:&nbsp;/\.ts(x?)$/,</p>
<p> &nbsp; &nbsp; &nbsp;exclude:&nbsp;/node_modules/,</p>
<p> &nbsp; &nbsp; &nbsp;use:&nbsp;[</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp;{</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;loader:&nbsp;"babel-loader",</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;options:&nbsp;{</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;plugins:&nbsp;[</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;[</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;"import",</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;{</p>
<p>
   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;libraryName:&nbsp;"antd",
</p>
<p>
   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;libraryDirectory:&nbsp;"es",
</p>
<p>
   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;style:&nbsp;true,
</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;},</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;],</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;],</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;},</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp;},</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp;"ts-loader",</p>
<p> &nbsp; &nbsp; &nbsp;],</p>
<p> &nbsp; &nbsp;},</p>
<p> &nbsp;],</p>
<p>},</p>
<p>```</p>
<p>
  ###&nbsp;解决开启&nbsp;css&nbsp;模块化导致&nbsp;antd&nbsp;自定义主题失效的问题
</p>
<p>
  解决这个问题需要在&nbsp;webpack&nbsp;中配置两次&nbsp;`less-loader`，在未开启&nbsp;css&nbsp;模块化的&nbsp;less-loader&nbsp;中设置&nbsp;antd&nbsp;自定义主题的配置，在未设置&nbsp;antd&nbsp;自定义主题的&nbsp;less-loader&nbsp;中开启&nbsp;css&nbsp;模块化，具体配置如下：
</p>
<p>```js</p>
<p>module:&nbsp;{</p>
<p> &nbsp;rules:&nbsp;[</p>
<p> &nbsp; &nbsp;/**</p>
<p>
   &nbsp; &nbsp; *&nbsp;使用两次less-loader解决开启css模块化时导致antd自定义主题失效的问题。
</p>
<p>
   &nbsp; &nbsp; *&nbsp;需要在不开启模块化时，设置antd自定义主题才会生效，因此这一个less-loader使用include针对node_modules中的组件库（即antd）在不开启css块化的情况下，开启自定义主题的设置。
</p>
<p> &nbsp; &nbsp; *</p>
<p> &nbsp; &nbsp; */</p>
<p> &nbsp; &nbsp;{</p>
<p> &nbsp; &nbsp; &nbsp;test:&nbsp;/\.less$/,</p>
<p> &nbsp; &nbsp; &nbsp;include:&nbsp;[/node_modules/],</p>
<p> &nbsp; &nbsp; &nbsp;use:&nbsp;[</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp;"style-loader",</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp;"css-loader",</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp;"postcss-loader",</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp;{</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;loader:&nbsp;"less-loader",</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;options:&nbsp;{</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;lessOptions:&nbsp;{</p>
<p>
   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;//&nbsp;如果使用less-loader@5，请移除&nbsp;lessOptions&nbsp;这一级直接配置选项。
</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;sourceMap:&nbsp;true,</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;modifyVars:&nbsp;{</p>
<p>
   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;"primary-color":&nbsp;"#1DA57A",
</p>
<p>
   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;"link-color":&nbsp;"#1DA57A",
</p>
<p>
   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;"border-radius-base":&nbsp;"2px",
</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;},</p>
<p>
   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;javascriptEnabled:&nbsp;true,
</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;},</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;},</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp;},</p>
<p> &nbsp; &nbsp; &nbsp;],</p>
<p> &nbsp; &nbsp;},</p>
<p> &nbsp; &nbsp;/**</p>
<p>
   &nbsp; &nbsp; *&nbsp;该less-loader使用exclude排除node_modules中的组件库，只针对自己的代码开启css模块化
</p>
<p> &nbsp; &nbsp; */</p>
<p> &nbsp; &nbsp;{</p>
<p> &nbsp; &nbsp; &nbsp;test:&nbsp;/\.less$/,</p>
<p> &nbsp; &nbsp; &nbsp;exclude:&nbsp;[/node_modules/],</p>
<p> &nbsp; &nbsp; &nbsp;use:&nbsp;[</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp;"style-loader",</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp;//&nbsp;配置less模块化导入</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp;{</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;loader:&nbsp;"css-loader",</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;options:&nbsp;{</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;modules:&nbsp;{</p>
<p>
   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;localIdentName:&nbsp;"[name]__[local]--[hash:base64:5]",
</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;},</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;importLoaders:&nbsp;1,</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;},</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp;},</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp;"postcss-loader",</p>
<p> &nbsp; &nbsp; &nbsp; &nbsp;"less-loader",</p>
<p> &nbsp; &nbsp; &nbsp;],</p>
<p> &nbsp; &nbsp;},</p>
<p> &nbsp;],</p>
<p>},</p>
<p>```</p>
<p>###&nbsp;防止&nbsp;browserRouter&nbsp;路由模式出现&nbsp;404</p>
<p>需要在&nbsp;webpack&nbsp;中的&nbsp;`devServer`&nbsp;中配置如下属性：</p>
<p>```js</p>
<p>historyApiFallback:&nbsp;true,</p>
<p>```</p>
<p>###&nbsp;解决页面切到子路由时出现找不到&nbsp;js&nbsp;资源的报错</p>
<p>
  要防止刷新页面后出现页面丢失报：`GET&nbsp;http://localhost:9000/home/js/bundle.js&nbsp;net::ERR_ABORTED&nbsp;404&nbsp;(Not&nbsp;Found)`，需要在&nbsp;`output`&nbsp;中增加&nbsp;`publicPath`&nbsp;属性，配置如下：
</p>
<p>```js</p>
<p>output:&nbsp;{</p>
<p> &nbsp;filename:&nbsp;"js/[name]-bundle-[hash:6].js",</p>
<p> &nbsp;path:&nbsp;path.resolve(__dirname,&nbsp;"../dist"),</p>
<p> &nbsp;publicPath:&nbsp;"/",</p>
<p>},</p>
<p>```</p>
<p>###&nbsp;解决&nbsp;eslint&nbsp;与&nbsp;Prettier&nbsp;之间的冲突</p>
<p>首先安装如下插件：</p>
<p>```</p>
<p>
  yarn&nbsp;add&nbsp;eslint-config-prettier&nbsp;eslint-plugin-prettier&nbsp;-D
</p>
<p>```</p>
<p>之后在&nbsp;`.eslintrc.js`&nbsp;中修改如下配置：</p>
<p>```js</p>
<p>{</p>
<p> &nbsp;//&nbsp;...</p>
<p> -&nbsp;"extends":&nbsp;["eslint:recommended",&nbsp;"standard"]</p>
<p>
   +&nbsp;"extends":&nbsp;["eslint:recommended",&nbsp;"standard",&nbsp; "plugin:prettier/recommended"]
</p>
<p> &nbsp;//&nbsp;...</p>
<p>}</p>
<p>```</p>
<p>###&nbsp;解决路径别名&nbsp;eslint&nbsp;报错</p>
<p>首先安装如下插件：</p>
<p>```js</p>
<p>yarn&nbsp;add&nbsp;eslint-import-resolver-webpack&nbsp;-D</p>
<p>```</p>
<p>增加一个与&nbsp;rules&nbsp;配置同级的&nbsp;settings&nbsp;配置：</p>
<p>```json</p>
<p>"import/resolver":&nbsp;{</p>
<p> &nbsp;"webpack":&nbsp;{</p>
<p> &nbsp; &nbsp;"config":&nbsp;"./config/webpack.common.config.js"</p>
<p> &nbsp;}</p>
<p>}</p>
<p>```</p>
<p>###&nbsp;配置&nbsp;husky</p>
<p>首先需要安装&nbsp;husky：</p>
<p>```js</p>
<p>yarn&nbsp;add&nbsp;husky&nbsp;-D</p>
<p>```</p>
<p>
  之后执行如下命令生成&nbsp;`.husky`&nbsp;文件，并在该文件夹下生成&nbsp;`pre-commit`&nbsp;文件：
</p>
<p>```js</p>
<p>npm&nbsp;set-script&nbsp;prepare&nbsp;"husky&nbsp;install"</p>
<p>npm&nbsp;run&nbsp;prepare</p>
<p>npx&nbsp;husky&nbsp;add&nbsp;.husky/pre-commit&nbsp;"npm&nbsp;test"</p>
<p>```</p>
<p>
  &gt;&nbsp;注意：执行&nbsp;npm&nbsp;set-script&nbsp;prepare&nbsp;"husky&nbsp;install"&nbsp;之前，必须要先使用&nbsp;git&nbsp;init&nbsp;创建&nbsp;.git&nbsp;文件，否则将会执行失败。
</p>
<p>最后在&nbsp;`package.json`&nbsp;文件中增加如下两条脚本：</p>
<p>```js</p>
<p>{</p>
<p> &nbsp;"scripts":&nbsp;{</p>
<p> &nbsp; &nbsp;//&nbsp;...</p>
<p>+&nbsp; &nbsp;"prepare":&nbsp;"husky&nbsp;install",</p>
<p>+&nbsp; &nbsp;"test":&nbsp;"npx&nbsp;eslint&nbsp;./src"</p>
<p> &nbsp;}</p>
<p>}</p>
<p>```</p>
<p>###&nbsp;npx&nbsp;eslint&nbsp;./src</p>
<p>
  注意：如果&nbsp;src&nbsp;的入口文件是&nbsp;`.ts&nbsp;|&nbsp;.tsx`&nbsp;时，执行&nbsp;`npx&nbsp;eslint&nbsp;./src`&nbsp;会出现找不到&nbsp;src&nbsp;文件的报错，因此在执行的时候需要加上如下后缀：
</p>
<p>```js</p>
<p>npx&nbsp;eslint&nbsp;./src&nbsp;--ext&nbsp;ts,tsx</p>
<p>```</p>
<p>
  配置自动修复部分&nbsp;eslint&nbsp;报错，只需要在上述脚本的末尾加上&nbsp;`--fix`&nbsp;即可：
</p>
<p>```js</p>
<p>npx&nbsp;eslint&nbsp;./src&nbsp;--ext&nbsp;ts,tsx&nbsp;--fix</p>
<p>```</p>
<p>###&nbsp;husky&nbsp;执行报错处理</p>
<p>
  当使用&nbsp;mac&nbsp;生成&nbsp;`.husky`&nbsp;文件时，在&nbsp;windows&nbsp;上执行会报：`error:&nbsp;cannot&nbsp;spawn&nbsp;.husky/pre-commit:&nbsp;No&nbsp;such&nbsp;file&nbsp;or&nbsp;directory`&nbsp;这个错误，出现这个错误的原因是因为&nbsp;mac&nbsp;与&nbsp;windows&nbsp;两者之间的换行符不同。
</p>
<p>
  解决这个报错的方式是：将原有的&nbsp;`.husky`&nbsp;文件删除，重新执行上述命令生成。
</p>
<p>###&nbsp;处理&nbsp;LF&nbsp;与&nbsp;CRLF&nbsp;转换问题</p>
<p>
  Git&nbsp;可以在你&nbsp;push&nbsp;时自动地把行结束符&nbsp;CRLF&nbsp;转换成&nbsp;LF，而在&nbsp;pull&nbsp;代码时把&nbsp;LF&nbsp;转换成&nbsp;CRLF。用&nbsp;`core.autocrlf`&nbsp;来打开此项功能，如果是在&nbsp;Windows&nbsp;系统上，把它设置成&nbsp;`true`，这样当签出代码时，LF&nbsp;会被转换成&nbsp;CRLF：
</p>
<p>```js</p>
<p>git&nbsp;config&nbsp;--global&nbsp;core.autocrlf&nbsp;true</p>
<p>```</p>
<p>
  Linux&nbsp;或&nbsp;Mac&nbsp;系统使用&nbsp;LF&nbsp;作为行结束符；当一个以&nbsp;CRLF&nbsp;为行结束符的文件不小心被引入时你肯定想进行修正，把&nbsp;`core.autocrlf`&nbsp;设置成&nbsp;`input`&nbsp;来告诉&nbsp;Git&nbsp;在&nbsp;push&nbsp;时把&nbsp;CRLF&nbsp;转换成&nbsp;LF，pull&nbsp;时不转换：
</p>
<p>```js</p>
<p>git&nbsp;config&nbsp;--global&nbsp;core.autocrlf&nbsp;input</p>
<p>```</p>
<p>
  在本地和代码库中都保留&nbsp;LF，无论&nbsp;pull&nbsp;还是&nbsp;push&nbsp;都不变，代码库什么样，本地还是什么样子：
</p>
<p>```js</p>
<p>git&nbsp;config&nbsp;--global&nbsp;core.autocrlf&nbsp;false</p>
<p>```</p>
