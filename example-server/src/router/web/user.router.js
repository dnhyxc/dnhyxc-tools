const Router = require('koa-router');
const { createTodoCtr } = require('../../controller');

const router = new Router({ prefix: '/web-api' });

// 注册接口
router.post('/createTodo', createTodoCtr);

module.exports = router;
