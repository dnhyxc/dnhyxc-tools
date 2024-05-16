import { defineConfig } from 'vitest/config';
import { vitestConfig } from '../../scripts/vitest-config.mjs';

const config = vitestConfig({ folder: 'vite-plugins' });

export default defineConfig(config);
