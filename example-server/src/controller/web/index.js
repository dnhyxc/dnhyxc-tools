const { databaseError } = require('../../constant');
const { createTodo } = require('../../service');

class createTodoController {
  async createTodoCtr(ctx) {
    try {
      const params = ctx.request.body;
      const res = await createTodo(params);
      ctx.body = {
        code: 200,
        message: '添加成功',
        success: true,
        data: res._id,
      };
    } catch (error) {
      console.error('createTodoCtr', error);
      ctx.app.emit('error', databaseError, ctx);
    }
  }
}

module.exports = new createTodoController();
