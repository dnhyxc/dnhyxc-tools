### dnhyxc-ci 安装

全局安装 `@dnhyxc/ci`：可以在各个项目中使用，无需单独为每个项目安装。

```yaml
npm install -g @dnhyxc/ci
```

或者在项目中单独安装：

```yaml
npm install --save-dev @dnhyxc/ci
```

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
  // 项目配置
  porjectInfo: {
    dnhyxc: {
      name: 'dnhyxc',
      // 本地项目路径
      localFilePath: '/Users/dnhyxc/Documents/code/dnhyxc',
      // 目标服务器项目文件路径
      remoteFilePath: '/usr/local/nginx/dnhyxc',
      // 标识是否是服务端项目
      isServer: false
    },
    blogClientWeb: {
      name: 'html',
      // 本地项目路径
      localFilePath: '/Users/dnhyxc/Documents/code/blog-client-web',
      // 目标服务器项目文件路径
      remoteFilePath: '/usr/local/nginx/html',
      // 标识是否是服务端项目
      isServer: false
    },
    blogAdminWeb: {
      name: 'admin_html',
      // 本地项目路径
      localFilePath: '/Users/dnhyxc/Documents/code/blog-admin-web',
      // 目标服务器项目文件路径
      remoteFilePath: '/usr/local/nginx/html_admin',
      // 标识是否是服务端项目
      isServer: false
    },
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

1. `dnhyxc -h` 或 `dnhyxc --help` 查看帮助。

2. `dnhyxc-ci publish --help` 查看发布帮助。

3. `dnhyxc -v` 或 `dnhyxc --version` 查看版本。

4. `dnhyxc publish <projectName>` 发布项目。

5. `dnhyxc publish <projectName> -h` 携带 host。

6. `dnhyxc publish <projectName> -p` 携带端口号。

7. `dnhyxc publish <projectName> -u` 携带用户名。

8. `dnhyxc publish <projectName> -m` 携带密码。

9. `dnhyxc publish <projectName> -l` 携带本地项目路径。

10. `dnhyxc publish <projectName> -r` 携带远程目标文件路径。

11. `dnhyxc publish <projectName> -i` 是否需要安装依赖，只对发布服务代码生效。
