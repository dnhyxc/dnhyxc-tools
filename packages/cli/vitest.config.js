import { defineConfig } from 'vitest/config';
import { vitestConfig } from '../../scripts/vitest-config.mjs';

// folder: 'cli'，当前包的文件夹名称
const config = vitestConfig({ folder: 'cli' });

export default defineConfig(config);
