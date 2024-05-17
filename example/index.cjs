/* eslint-disable @typescript-eslint/no-var-requires */
const { ViteElectronBuildPlugin, ViteElectronRuntimePlugin } = require('../packages/vite-plugins/dist/index.cjs');
const { dnhyxc } = require('../packages/cli/dnhyxc.cjs');

console.log(ViteElectronBuildPlugin, 'ViteElectronBuildPlugin');
console.log(ViteElectronRuntimePlugin, 'ViteElectronRuntimePlugin');

console.log(dnhyxc, 'dnhyxc');