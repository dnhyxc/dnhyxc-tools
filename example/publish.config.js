module.exports = {
  // 服务器配置
  serverInfo: {
    // 目标服务器IP
    host: '106.69.29.11',
    // 目标服务器用户名
    username: 'root',
    // 端口号
    port: 22,
  },
  // nginx 配置
  nginxInfo: {
    remoteFilePath: '/usr/local/nginx/conf',
    restartPath: '/usr/local/nginx/sbin',
  },
  // node 服务端配置
  serviceInfo: {
    restartPath: '/usr/local/server',
  },
  // 前台项目1配置
  dnhyxc: {
    name: 'dnhyxc',
    // 本地项目路径
    localFilePath: '/Users/dnhyxc/Documents/code/dnhyxc',
    // 目标服务器项目文件路径
    remoteFilePath: '/usr/local/nginx/dnhyxc',
    // 标识是否是服务端项目
    isServer: false,
  },
  // 前台项目2配置
  blogClientWeb: {
    name: 'html',
    // 本地项目路径
    localFilePath: '/Users/dnhyxc/Documents/code/blog-client-web',
    // 目标服务器项目文件路径
    remoteFilePath: '/usr/local/nginx/html',
    // 标识是否是服务端项目
    isServer: false,
  },
  // 前台项目3配置
  blogAdminWeb: {
    name: 'admin_html',
    // 本地项目路径
    localFilePath: '/Users/dnhyxc/Documents/code/blog-admin-web',
    // 目标服务器项目文件路径
    remoteFilePath: '/usr/local/nginx/html_admin',
    // 标识是否是服务端项目
    isServer: false,
  },
  // 后台node服务端项目配置
  blogServerWeb: {
    name: 'server',
    // 本地项目路径
    localFilePath: '/Users/dnhyxc/Documents/code/blog-server-web',
    // 目标服务器项目文件路径
    remoteFilePath: '/usr/local/server',
    // 标识是否是服务端项目
    isServer: true,
  },
};