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

export interface ProjectInfo {
  name: string;
  localFilePath: string;
  remoteFilePath: string;
  isServer: boolean;
}

export interface PublishConfigParams {
  serverInfo: ServerInfo;
  nginxInfo: NginxInfo;
  serviceInfo: ServiceInfo;
  [projectName: string]: ProjectInfo | ServerInfo | NginxInfo | ServiceInfo;
}

export type ConfigType = keyof PublishConfigParams;
