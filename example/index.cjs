// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ViteElectronBuildPlugin, ViteElectronRuntimePlugin } = require('../packages/vite-plugins/dist/index.cjs');

console.log(ViteElectronBuildPlugin, 'ViteElectronBuildPlugin');
console.log(ViteElectronRuntimePlugin, 'ViteElectronRuntimePlugin');
