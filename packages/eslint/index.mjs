import eslint from '@eslint/js';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsEslintParser from '@typescript-eslint/parser';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

// 导出 Prettier 和 ESLint 的推荐配置
export const prettierConfig = eslintPluginPrettierRecommended;
export const eslintRecommendedConfig = eslint.configs.recommended;

// 导出全局配置
export const globalConfig = {
  name: 'global config',
  languageOptions: {
    globals: { ...globals.es2022, ...globals.browser, ...globals.node },
    sourceType: 'module'
  },
  rules: {
    'no-dupe-class-members': 0,
    'no-redeclare': 0,
    'no-undef': 0,
    'no-unused-vars': 'warn',
    'no-console': 'warn'
  }
};

// 导出 Vue 配置
export const vueConfig = {
  name: 'vue-eslint',
  files: ['**/*.vue'],
  languageOptions: {
    parser: vueParser,
    parserOptions: {
      parser: tsEslintParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      extraFileExtensions: ['.vue'],
      ecmaFeatures: { jsx: false }
    }
  },
  plugins: { vue: vuePlugin },
  rules: {
    ...(vuePlugin.configs?.recommended?.rules || {}),
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off'
  }
};

// 导出 TypeScript 配置
export const tsConfig = {
  name: 'typescript-eslint/base',
  files: ['**/*.{js,ts}'],
  languageOptions: {
    parser: tsEslintParser,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: false } }
  },
  rules: {
    ...(tsEslintPlugin.configs?.recommended?.rules || {}),
    '@typescript-eslint/no-confusing-non-null-assertion': 2,
    '@typescript-eslint/ban-ts-comment': 0
  },
  plugins: { '@typescript-eslint': tsEslintPlugin }
};

// 导出忽略配置
export const ignoresConfig = {
  ignores: ['node_modules/**']
};

// 检查配置中是否包含指定的部分
const hasConfigPart = (configParts, type) => {
  return Object.prototype.hasOwnProperty.call(configParts, type)
}

// 从配置中解构并设置默认值
const getConfigValue = (configParts, key, defaultValue) => (
  hasConfigPart(configParts, key) ? configParts[key] : defaultValue
);

/**
 * 创建 ESLint 配置
 * @param {object} [configParts={}] - 用于覆盖或添加的配置部分
 * @param {object} [configParts.recommended] - 覆盖 eslint.configs.recommended 配置
 * @param {object} [configParts.prettier] - 在末尾添加额外的 Prettier 配置
 * @param {object} [configParts.global] - 覆盖默认的全局配置
 * @param {object} [configParts.vue] - 覆盖默认的 Vue 配置
 * @param {object} [configParts.ts] - 覆盖默认的 TypeScript 配置
 * @param {object} [configParts.ignores] - 覆盖默认的忽略配置
 * @param {Array} [configParts.custom] - 在末尾添加额外的自定义配置
 * @returns {Array}
 */
export function createEslintConfig(configParts = {}) {
  const {
    recommended = getConfigValue(configParts, 'recommended', eslintRecommendedConfig),
    prettier = getConfigValue(configParts, 'prettier', prettierConfig),
    global = getConfigValue(configParts, 'global', globalConfig),
    vue = getConfigValue(configParts, 'vue', vueConfig),
    ts = getConfigValue(configParts, 'ts', tsConfig),
    ignores = getConfigValue(configParts, 'ignores', ignoresConfig),
    custom = getConfigValue(configParts, 'custom', [])
  } = configParts;

  return [
    recommended,
    prettier,
    global,
    vue,
    ts,
    ignores,
    ...custom
  ].filter(Boolean) // 过滤掉 falsy 值（false、null、undefined、0、''、NaN）
}

// 默认导出一个基础配置实例
export default createEslintConfig();