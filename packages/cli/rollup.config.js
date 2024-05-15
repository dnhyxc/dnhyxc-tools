import { defineConfig } from 'rollup';
import { buildConfig } from '../../scripts/build-config.mjs';

// 包名称：dnhyxc
const configs = buildConfig({ packageName: 'dnhyxc' });

export default defineConfig(configs);
