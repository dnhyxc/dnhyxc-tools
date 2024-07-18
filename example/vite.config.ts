import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import { ViteElectronBuildPlugin, ViteElectronRuntimePlugin } from 'dnhyxc-vite-plugins';

// console.log(ViteElectronBuildPlugin, 'ViteElectronBuildPlugin');
// console.log(ViteElectronRuntimePlugin, 'ViteElectronRuntimePlugin');

export default defineConfig({
  plugins: [vue()]
});
