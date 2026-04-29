export interface Options {
  host: string;
  port: string;
  username: string;
  password: string;
  localFilePath: string;
  remoteFilePath: string;
  install: boolean;
  isServer: boolean;
}

export interface CollectInfoParams extends Partial<Options> {
  publishConfig: PublishConfigParams;
  command?: string;
  nginxRemoteFilePath?: string;
  projectName?: string;
  nginxRestartPath?: string;
  serviceRestartPath?: string;
  restartScript?: string;
}

export interface ServerInfo {
  host: string;
  port: string;
  username: string;
}

export interface NginxInfo {
  restartPath: string;
  remoteFilePath: string;
}

export interface ServiceInfo {
  restartPath: string;
}

export interface LocalFilePath {
  win: string;
  mac: string;
}

export interface ProjectInfo {
  name: string;
  localFilePath: LocalFilePath;
  remoteFilePath: string;
  isServer: boolean;
}

export interface PublishConfigParams {
  serverInfo: ServerInfo;
  nginxInfo: NginxInfo;
  serviceInfo: ServiceInfo;
  // 根级字段：用于 node 服务重启时执行的命令，如 "pm2 restart server"
  restartScript?: string;
  // 兼容其他项目配置（例如 dnhyxc、example 等）
  [projectName: string]: ProjectInfo | ServerInfo | NginxInfo | ServiceInfo | string | undefined;
}

export type ConfigType = keyof PublishConfigParams;
