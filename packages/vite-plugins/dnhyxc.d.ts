declare const ViteElectronBuildPlugin: () => {
    name: string;
    closeBundle(): void;
};

declare const ViteElectronRuntimePlugin: () => {
    name: string;
    configureServer(server: {
        httpServer?: any;
        close?: () => void;
    }): void;
};

export { ViteElectronBuildPlugin, ViteElectronRuntimePlugin };
