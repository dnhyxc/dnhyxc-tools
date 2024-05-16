### ES6 使用

```js
import { ViteElectronRuntimePlugin, ViteElectronBuildPlugin } from 'dnhyxc-vite-plugins';

export default defineConfig({
  plugins: [ViteElectronRuntimePlugin(), ViteElectronBuildPlugin()]
});
```

### CommonJS 使用

```js
const { ViteElectronRuntimePlugin, ViteElectronBuildPlugin } = require('dnhyxc-vite-plugins');
```
