const { WebUser } = require('../../models');

class UserServer {
  async createUser(params) {
    return WebUser.create(params);
  }

  async findUserById(params) {
    return await WebUser.findById(params.id);
  }
}

module.exports = new UserServer();
