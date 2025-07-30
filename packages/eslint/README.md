## @dnhyxc/eslint

一个集成了 `Prettier`、`Vue`、`JavaScript` 和 `TypeScript` 的可共享 ESLint 配置。

## 特性

- 集成了 Prettier，统一代码风格。

- 支持 Vue 3，包含推荐规则。

- 支持 TypeScript，提供类型检查规则。

- 提供一个灵活的 `createEslintConfig` 函数，用于轻松定制配置。

- 默认导出开箱即用的配置。

## 安装

首先，安装 `@dnhyxc/eslint` 包：

```bash
pnpm install @dnhyxc/eslint --save-dev
```

然后，安装所有必需的 `peerDependencies` 对等依赖：

```bash
pnpm install eslint @eslint/js @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-prettier eslint-plugin-vue globals vue-eslint-parser --save-dev
```

## 使用方法

在您的项目根目录下创建一个 `eslint.config.js` 文件。

### 基本用法

如果您只需要对 `js`、`ts`、`vue` 文件进行 eslint 检查，那么可以直接导入默认配置：

```js
import eslintConfig from '@dnhyxc/eslint';

export default eslintConfig;
```

### 高级用法

为了更灵活地控制配置，您可以使用 `createEslintConfig` 函数。这个函数允许您覆盖默认配置或添加新的配置。

`createEslintConfig(configParts)` 接受一个对象作为参数，包含以下可选属性：

- global：覆盖默认的全局配置。

- vue：覆盖默认的 Vue 配置。

- ts：覆盖默认的 TypeScript 配置。

- ignores：覆盖默认的忽略配置。

- custom：一个数组，用于在末尾添加额外的自定义配置。

#### 使用示例 1

自定义规则：假设您想禁用 `no-console` 规则，并添加一个新的全局变量。

```js
import { createEslintConfig } from '@dnhyxc/eslint';

const customGlobalConfig = {
  name: 'custom-global-config',
  languageOptions: {
    globals: {
      myGlobal: 'readonly'
    }
  },
  rules: {
    'no-console': 'off' // 关闭 no-console 规则
  }
};

export default createEslintConfig({
  global: customGlobalConfig
});
```

#### 使用示例 2

添加自定义配置：如果您想在现有配置的基础上添加一个全新的配置块（例如，针对测试文件）。

```js
import { createEslintConfig } from '@dnhyxc/eslint';

const testFilesConfig = {
  files: ['**/*.test.js', '**/*.spec.js'],
  rules: {
    'no-unused-expressions': 'off'
  }
};

export default createEslintConfig({
  custom: [testFilesConfig]
});
```

#### 使用示例 3

禁用 Vue 或 TypeScript：如果您的项目不使用 Vue，您可以将 vue 配置设置为 `null` 或 `false` 等一切为 `falsy` 的值。

```js
import { createEslintConfig } from '@dnhyxc/eslint';

// 一个没有 Vue 的 Node.js + TypeScript 项目
export default createEslintConfig({
  vue: false,
  ts: false
});
```

#### 使用示例 4

自定义 TypeScript 规则：假设您想修改 TypeScript 的解析器选项，并禁用某条规则。

```js
import { createEslintConfig, tsConfig } from '@dnhyxc/eslint';

const customTsConfig = {
  ...tsConfig, // 继承默认的 ts 配置
  languageOptions: {
    ...tsConfig.languageOptions,
    parserOptions: {
      ...tsConfig.languageOptions.parserOptions
    }
  },
  rules: {
    ...tsConfig.rules,
    '@typescript-eslint/no-explicit-any': 'off' // 允许使用 any 类型
  }
};

export default createEslintConfig({
  ts: customTsConfig
});
```

#### 使用示例 5

自定义忽略文件：默认情况下， `node_modules` 会被忽略。如果您想添加其他需要忽略的目录，比如 `dist` 和 `build`。

```js
import { createEslintConfig } from '@dnhyxc/eslint';

const customIgnores = {
  ignores: ['node_modules/**', 'dist/**', 'build/**']
};

export default createEslintConfig({
  ignores: customIgnores
});
```

#### 使用示例 6

自定义 Prettier 配置：如果您不想要 `prettier` 推荐配置，可以将其设置为 `null` 或 `false` 等一切为 `falsy` 的值。

```js
import { createEslintConfig } from '@dnhyxc/eslint';

export default createEslintConfig({
  prettier: false // 禁用 Prettier
});
```
