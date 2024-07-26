### dnhyxc-ci 安装

全局安装 `dnhyxc-ci`：可以在各个项目中使用，无需单独为每个项目安装。

```yaml
npm install -g dnhyxc-ci
```

全局使用 `dnhyxc-ci`，直接在需要发布的项目根目录下运行 `dnhyxc-ci publish xxx（项目名称）` 即可。

```yaml
dnhyxc-ci publish projectName
```

或者在项目中单独安装：

```yaml
npm install --save-dev dnhyxc-ci
```

如果在项目中单独安装 `dnhyxc-ci`，需要在 `package.json` 中添加以下脚本命令：

```json
{
  "scripts": {
    "publish": "dnhyxc-ci publish projeptName"
  }
}
```

或者直接通过 `npx` 运行，即直接在需要发布的项目根目录下运行如下命令：

```yaml
npx dnhyxc-ci publish projectName
```

> 注意：如果是发布后台服务，在项目中单独安装 `dnhyxc-ci` 后，需要将 `package.json` 中的 `dnhyxc-ci` 包名删除，因为发布服务代码时，会将 `package.json` 发布到服务器上，从而导致服务器上安装依赖时可能会因为 `dnhyxc-ci` 包的 node 版本问题导致安装失败。

### 配置项目发布文件

在需要发布的项目根目录下，创建 `publish.config.js` 配置文件，当然可以不创建该文件，直接在命令行中指定参数，或者通过交互式命令行输入。配置该文件，可以大大提高发布时的效率，减少手动输入的内容。具体参考以下示例：

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
    remoteFilePath: '/usr/local/nginx/conf',
    restartPath: '/usr/local/nginx/sbin'
  },
  // node服务配置
  serviceInfo: {
    restartPath: '/usr/local/server'
  },
  // 项目配置
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
};
```

### 查看帮助

通过 `dnhyxc-ci -h` 或 `dnhyxc --help` 查看帮助。

```yaml
dnhyxc-ci -h

# 或

dnhyxc --help
```

### 发布项目

通过 `dnhyxc-ci publish <projectName>` 命令发布项目，其中 `<projectName>` 为 `publish.config.js` 配置文件中 `projectInfo` 下的项目名称。

```yaml
dnhyxc-ci publish projectName
```

#### dnhyxc-ci publish 相关命令说明

```yaml
dnhyxc-ci publish <projectName> -h  # 携带服务器 host。

dnhyxc-ci publish <projectName> -p  # 携带服务器端口号。

dnhyxc-ci publish <projectName> -u  # 携带服务器用户名。

dnhyxc-ci publish <projectName> -m  # 携带服务器密码。

dnhyxc-ci publish <projectName> -l  # 携带本地项目路径。

dnhyxc-ci publish <projectName> -r  # 携带远程目标文件路径。

dnhyxc-ci publish <projectName> -s  # 是否是 node 服务端项目。

dnhyxc-ci publish <projectName> -i  # 是否需要安装依赖，只对发布服务代码生效。
```

### 拉取远程 nginx 配置文件

通过 `dnhyxc-ci pull` 命令拉取远程 nginx 配置文件到本地。

```yaml
dnhyxc-ci pull
```

#### dnhyxc-ci pull 相关命令说明

```yaml
dnhyxc-ci pull -h  # 携带服务器 host。

dnhyxc-ci pull -p  # 携带服务器端口号。

dnhyxc-ci pull -u  # 携带服务器用户名。

dnhyxc-ci pull -m  # 携带服务器密码。

dnhyxc-ci pull -ncp  # 携带远程 nginx 配置文件路径。
```

### 推送 nginx 配置文件到远程服务器

通过 `dnhyxc-ci push` 命令推送本地 nginx 配置文件到远程服务器。

```yaml
dnhyxc-ci push
```

#### dnhyxc-ci push 相关命令说明

```yaml
dnhyxc-ci push -h  # 携带服务器 host。

dnhyxc-ci push -p  # 携带服务器端口号。

dnhyxc-ci push -u  # 携带服务器用户名。

dnhyxc-ci push -m  # 携带服务器密码。

dnhyxc-ci push -nlp  # 携带本地 nginx 配置文件路径。

dnhyxc-ci push -nrp  # 携带远程 nginx 重启路径。
```

### 重启 nginx 或 node 服务

通过 `dnhyxc-ci restart <serviceName>` 命令重启 nginx 或 node 服务。

```yaml
dnhyxc-ci restart serviceName
```

#### dnhyxc-ci restart 相关命令说明

```yaml
dnhyxc-ci restart <serviceName> -h  # 携带服务器 host。

dnhyxc-ci restart <serviceName> -p  # 携带服务器端口号。

dnhyxc-ci restart <serviceName> -u  # 携带服务器用户名。

dnhyxc-ci restart <serviceName> -m  # 携带服务器密码。

dnhyxc-ci restart <serviceName> -ncp  # 携带远程 nginx 配置文件路径。

dnhyxc-ci restart <serviceName> -nrp  # 携带服务器 nginx 重启路径。

dnhyxc-ci restart <serviceName> -srp  # 携带服务器 node 重启路径。
```

### 查看 node 服务相关进程的状态和日志信息

通过 `dnhyxc-ci list` 命令查看 node 服务相关进程的状态和日志信息。

```yaml
dnhyxc-ci list
```

#### dnhyxc-ci list 相关命令说明

```yaml
dnhyxc-ci restart <serviceName> -h  # 携带服务器 host。

dnhyxc-ci restart <serviceName> -p  # 携带服务器端口号。

dnhyxc-ci restart <serviceName> -u  # 携带服务器用户名。

dnhyxc-ci restart <serviceName> -m  # 携带服务器密码。
```
