const createTodoController = require('./web');
const createUserController = require('./admin');

const { createTodoCtr } = createTodoController;
const { adminCreateUserCtr } = createUserController;

module.exports = {
  createTodoCtr,
  adminCreateUserCtr
};
