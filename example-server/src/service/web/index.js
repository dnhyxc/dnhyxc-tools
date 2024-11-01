const { Todo } = require('../../models');

class TodoServer {
  async createTodo(params) {
    const existingTodo = await this.findOneTodo({ title: params.title });
    if (existingTodo) {
      throw new Error('该待办事项已存在');
    }
    return Todo.create(params);
  }

  async findOneTodo(params) {
    return await Todo.findOne(params);
  }
}

module.exports = new TodoServer();
