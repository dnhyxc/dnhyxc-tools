const mongoose = require("mongoose");

const DeploySchema = new mongoose.Schema({
  serverHost: String,
  serverPort: String,
  serverUsername: String,
  projectName: String, // 项目名称
  nginxRemoteFilePath: String, // nginx配置文件远程地址
  nginxRestartPath: String, // nginx重启命令路径
  serviceRemoveFilePath: String, // 服务重启命令路径
  projectLocalFilePath: String, // 本地项目地址
  projectRemoteFilePath: String, // 远程项目地址
  remoteLogFilePath: String, // 输出日志文件地址
  remoteErrorLogFilePath: String, // 错误日志文件地址
  isServer: Boolean, // 是否是服务端项目
  install: Boolean, // 是否是服务端项目
  projectRemoteDir: String, // 远程项目目录
  gitUrl: String, // git地址
  serverKey: String,
  createTime: Number,
  userId: String,
});

const DeployServer = mongoose.model("deployServer", DeploySchema);

const Deploy = mongoose.model("deploy", DeploySchema);

module.exports = { Deploy, DeployServer };
