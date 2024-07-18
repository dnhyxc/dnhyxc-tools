### dnhyxc-ci 安装

全局安装 `@dnhyxc/ci`：可以在各个项目中使用，无需单独为每个项目安装。

```yaml
npm install -g dnhyxc-ci
```

或者在项目中单独安装：

```yaml
npm install --save-dev dnhyxc-ci
```

> 注意：如果是发布后台服务，在项目中单独安装 `dnhyxc-ci` 后，需要将 `package.json` 中的 `dnhyxc-ci` 包名删除，因为发布服务代码时，会将 `package.json` 发布到服务器上，从而导致服务器上安装依赖时可能会因为 `dnhyxc-ci` 包的 node 版本问题导致安装失败。

### 使用方法

首先需要在需要发布的项目根目录下，创建 `publish.config.js` 配置文件，其中内容格式如下：

```js
module.exports = {
  // 服务器配置
  serverInfo: {
    // 目标服务器IP
    host: '106.69.29.11',
    // 目标服务器用户名
    username: 'root',
    // 端口号
    port: 22
  },
  // nginx配置
  nginxInfo: {
    remoteFilePath: '/usr/local/nginx/conf/nginx.conf',
    restartPath: '/usr/local/nginx/sbin'
  },
  // node服务配置
  serviceInfo: {
    restartPath: '/usr/local/server'
  },
  // 项目配置
  porjectInfo: {
    // 前端项目一
    dnhyxc: {
      name: 'dnhyxc',
      // 本地项目路径
      localFilePath: '/Users/dnhyxc/Documents/code/dnhyxc',
      // 目标服务器项目文件路径
      remoteFilePath: '/usr/local/nginx/dnhyxc',
      // 标识是否是服务端项目
      isServer: false
    },
    // 前端项目二
    blogClientWeb: {
      name: 'html',
      // 本地项目路径
      localFilePath: '/Users/dnhyxc/Documents/code/blog-client-web',
      // 目标服务器项目文件路径
      remoteFilePath: '/usr/local/nginx/html',
      // 标识是否是服务端项目
      isServer: false
    },
    // 前端项目三
    blogAdminWeb: {
      name: 'admin_html',
      // 本地项目路径
      localFilePath: '/Users/dnhyxc/Documents/code/blog-admin-web',
      // 目标服务器项目文件路径
      remoteFilePath: '/usr/local/nginx/html_admin',
      // 标识是否是服务端项目
      isServer: false
    },
    // 服务端项目
    blogServerWeb: {
      name: 'server',
      // 本地项目路径
      localFilePath: '/Users/dnhyxc/Documents/code/blog-server-web',
      // 目标服务器项目文件路径
      remoteFilePath: '/usr/local/server',
      // 标识是否是服务端项目
      isServer: true
    }
  }
};
```

上述配置文件配置完成之后，通过如下命令部署项目，其中 projectName 为项目名称，采用驼峰命名，与上述 porjectInfo 配置的项目名称一致。

```yaml
dnhyxc publish <projectName>
```

### 具体命令说明

1. `dnhyxc-ci -h` 或 `dnhyxc --help` 查看帮助。

2. `dnhyxc-ci -v` 或 `dnhyxc --version` 查看版本。

3. `dnhyxc-ci publish --help` 查看发布帮助。

4. `dnhyxc-ci publish <projectName>` 发布项目。

   4.1. `dnhyxc-ci publish <projectName> -h` 携带 host。

   4.2. `dnhyxc-ci publish <projectName> -p` 携带端口号。

   4.3. `dnhyxc-ci publish <projectName> -u` 携带用户名。

   4.4. `dnhyxc-ci publish <projectName> -m` 携带密码。

   4.5. `dnhyxc-ci publish <projectName> -l` 携带本地项目路径。

   4.6. `dnhyxc-ci publish <projectName> -r` 携带远程目标文件路径。

   4.7. `dnhyxc-ci publish <projectName> -i` 是否需要安装依赖，只对发布服务代码生效。

5. `dnhyxc-ci pull` 拉取 nginx.conf 配置文件到本地。

   5.1. `dnhyxc-ci pull-h` 携带 host。

   5.2. `dnhyxc-ci pull -p` 携带端口号。

   5.3. `dnhyxc-ci pull -u` 携带用户名。

   5.4. `dnhyxc-ci pull -m` 携带密码。

6. `dnhyxc-ci push` 推送 nginx.conf 配置文件到远程服务器。

   6.1. `dnhyxc-ci push -h` 携带 host。

   6.2. `dnhyxc-ci push -p` 携带端口号。

   6.3. `dnhyxc-ci push -u` 携带用户名。

   6.4. `dnhyxc-ci push -m` 携带密码。

7. `dnhyxc-ci restart <serviceName>` 重启指定服务，nginx 或者 node 服务。

   7.1. `dnhyxc-ci restart <serviceName> -h` 携带 host。

   7.2. `dnhyxc-ci restart <serviceName> -p` 携带端口号。

   7.3. `dnhyxc-ci restart <serviceName> -u` 携带用户名。

   7.4. `dnhyxc-ci restart <serviceName> -m` 携带密码。
