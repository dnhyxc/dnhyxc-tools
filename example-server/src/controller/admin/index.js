const { databaseError } = require('../../constant');
const { createUser } = require('../../service');

class adminCreateUserController {
  async adminCreateUserCtr(ctx) {
    try {
      const params = ctx.request.body;
      const res = await createUser(params);
      ctx.body = {
        code: 200,
        message: '注册成功',
        success: true,
        data: res._id,
      };
    } catch (error) {
      console.error('adminCreateUserCtr', error);
      ctx.app.emit('error', databaseError, ctx);
    }
  }
}

module.exports = new adminCreateUserController();
