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

export interface PublishConfigParams {
  serverInfo: {
    host: string;
    port: string;
    username: string;
  };
  nginxInfo: {
    restartPath: string;
    remoteFilePath: string;
  };
  serviceInfo: {
    restartPath: string;
  };
  projects: {
    [key: string]: ProjectInfo;
  };
}

export interface ProjectInfo {
  name: string;
  localFilePath: string;
  remoteFilePath: string;
  isServer: boolean;
}
