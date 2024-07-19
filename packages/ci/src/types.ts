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

export type PublishCollectParams = Omit<Options, 'isServer'> & {
  projectName: string;
  publishConfig: PublishConfigParams;
};

export interface CollectInfoParams extends Partial<Options> {
  publishConfig: PublishConfigParams;
  command?: string;
  nginxRemoteFilePath?: string;
  projectName?: string;
  nginxRestartPath?: string;
  serviceRestartPath?: string;
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
  projectInfo: {
    [key: string]: ProjectInfo;
  };
}

export type ConfigType = keyof PublishConfigParams;

export interface ProjectInfo {
  name: string;
  localFilePath: string;
  remoteFilePath: string;
  isServer: boolean;
}
