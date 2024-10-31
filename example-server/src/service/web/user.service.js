const { User } = require("../../models");
const { userFields } = require("../../constant");
class UserServer {
  // 注册用户
  async createUserServer({ username, password, phone, hash }) {
    return await User.create({
      username,
      password,
      phone,
      hash,
      registerTime: new Date().valueOf(),
    });
  }

  async findPhone({ hash }) {
    const _hash = await User.findOne({ hash }, { hash: 1, _id: 0 });
    return _hash;
  }

  // 用户登录
  async findOneUser(filter) {
    const user = await User.findOne(
      { ...filter, isDelete: { $nin: [true] } },
      {
        userId: `${"$_id".toString()}`,
        _id: 1,
        password: 1,
        ...userFields,
      }
    );

    return user;
  }

  // 根据userId获取用户信息
  async findUser(userId) {
    const user = await User.findOne(
      { _id: userId, isDelete: { $nin: [true] } },
      {
        userId: `${"$_id".toString()}`,
        _id: 1,
        ...userFields,
      }
    );
    return user;
  }

  // 根据id查找用户
  async findUserById(id) {
    const user = await User.findById(id, {
      userId: "$_id",
      _id: 0,
      ...userFields,
      logout: 1,
    });
    return user;
  }

  // 修改用户信息
  async updateUser(filter, newUserInfo) {
    const res = await User.updateOne(filter, {
      $set: newUserInfo,
    });
    return res.modifiedCount > 0 ? true : false;
  }

  // 注销账号
  async logout({ userId }) {
    const res = await User.deleteOne({ _id: userId });
    if (res.deletedCount) {
      return true;
    }
    return false;
  }
}

module.exports = new UserServer();
