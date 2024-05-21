import { defineConfig } from 'rollup';
import { buildConfig } from '../../scripts/build-config.mjs';

const configs = buildConfig({ packageName: 'dnhyxc-vite-plugins' });

export default defineConfig(configs);
