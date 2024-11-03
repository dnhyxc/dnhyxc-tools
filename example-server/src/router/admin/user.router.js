const Router = require('koa-router');
const { adminCreateUserCtr } = require('../../controller');


const router = new Router({ prefix: '/web-admin' });

router.post('/createUser', adminCreateUserCtr);

module.exports = router;
