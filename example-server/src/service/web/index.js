const { Todo } = require('../../models');

class TodoServer {
  async createTodo(params) {
    return Todo.create(params);
  }

  async findOneTodo(params) {
    return await Todo.findOne(params);
  }
}

module.exports = new TodoServer();
