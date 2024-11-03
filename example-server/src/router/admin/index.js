const Router = require('koa-router');
const fs = require('fs');

const router = new Router();

// 自动导入路由
fs.readdirSync(__dirname).forEach((file) => {
  if (file !== 'index.js') {
    let route = require('./' + file);
    router.use(route.routes());
  }
});

module.exports = router;
