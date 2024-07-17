module.exports = {
  // 服务器配置
  serverInfo: {
    // 目标服务器IP
    host: '101.43.50.15',
    // 目标服务器用户名
    username: 'root',
    // 端口号
    port: 22
  },
  nginxInfo: {
    remoteFilePath: '/usr/local/nginx/conf/nginx.conf',
    restartPath: '/usr/local/nginx/sbin'
  },
  serviceInfo: {
    restartPath: '/usr/local/server'
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
    example: {
      name: 'example',
      // 本地项目路径
      localFilePath: '/Users/dnhyxc/Documents/code/dnhyxc-tools/example',
      // 目标服务器项目文件路径
      remoteFilePath: '/usr/local/nginx/html_example',
      // 标识是否是服务端项目
      isServer: false
    }
  }
}