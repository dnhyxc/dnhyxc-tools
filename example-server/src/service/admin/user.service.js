const { AdminUsers, User, Article, Menus } = require("../../models");
const { userFields } = require("../../constant");

class UserServer {
  // 注册用户
  async adminCreateUserServer({ username, password }) {
    return await AdminUsers.create({
      username,
      password,
      registerTime: new Date().valueOf(),
    });
  }

  // 查找前台用户
  async adminFindOneUser(filter) {
    const user = await AdminUsers.findOne(
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

  // 批量查找前台用户
  async adminFindWebUsers(userIds) {
    const users = await User.find(
      { _id: { $in: userIds } },
      {
        userId: `${"$_id".toString()}`,
        _id: 1,
        ...userFields,
      }
    );
    return users;
  }

  // 批量查找后台用户
  async adminFindAdminUsers(userIds) {
    const users = await AdminUsers.find(
      { _id: { $in: userIds } },
      {
        userId: `${"$_id".toString()}`,
        _id: 1,
        ...userFields,
      }
    );
    return users;
  }

  // 根据id查找用户
  async adminFindUserById(id) {
    const user = await AdminUsers.findById(id, {
      userId: "$_id",
      _id: 0,
      ...userFields,
      logout: 1,
    });
    return user;
  }

  // 获取用户列表同时返回总条数
  async adminGetUserListWithTotal({ filterKey, pageNo, pageSize, searchType }) {
    const aggregateData = [
      { $match: filterKey || {} },
      {
        $facet: {
          total: [{ $count: "count" }],
          data: [
            {
              $project: {
                _id: 0, // 默认情况下_id是包含的，将_id设置为0|false，则选择不包含_id，其他字段也可以这样选择是否显示。
                id: "$_id", // 将_id更名为classify
                ...userFields,
              },
            },
            {
              $sort:
                searchType === 1
                  ? { updateTime: -1, registerTime: -1 }
                  : { registerTime: -1 },
            },
            { $skip: (pageNo - 1) * pageSize },
            { $limit: pageSize },
          ],
        },
      },
    ];

    const users =
      searchType === 1
        ? await User.aggregate(aggregateData)
        : await AdminUsers.aggregate(aggregateData);

    if (users?.length) {
      const { total, data } = users[0];
      return {
        total: total[0]?.count || 0,
        list: data || [],
      };
    }
    return {
      total: 0,
      list: [],
    };
  }

  // 查询前台用户列表
  async adminGetUserList({ keyword, pageNo, pageSize }) {
    // 头部搜索关键字不区分大小写
    const reg = (keyword && new RegExp(keyword, "i")) || "";
    // 处理头部搜索关键字
    const filterKey = { username: { $regex: reg } };
    const res = await new UserServer().adminGetUserListWithTotal({
      filterKey,
      pageNo,
      pageSize,
      searchType: 1, // 1：查前台用户列表  2：查后台用户列表
    });
    return res;
  }

  // 查询前台所有符合名称的用户
  async adminSearchUserList({ keyword }) {
    const reg = (keyword && new RegExp(keyword, "i")) || "";
    const filterKey = { username: { $regex: reg } };
    const res = await User.find(filterKey, {
      ...userFields,
    });
    return res;
  }

  // 查询后台用户列表
  async adminGetAdminUserList({ filterKey, pageNo, pageSize }) {
    const res = await new UserServer().adminGetUserListWithTotal({
      filterKey,
      pageNo,
      pageSize,
      searchType: 2, // 1：查前台用户列表  2：查后台用户列表
    });
    return res;
  }

  // 修改用户信息
  async adminUpdateUser(filter, newUserInfo) {
    const res = await AdminUsers.updateOne(filter, {
      $set: newUserInfo,
    });
    return res.modifiedCount > 0 ? true : false;
  }

  // 批量删除用户
  async adminBatchDeleteUser({ userIds }) {
    const res = await User.deleteMany({ _id: { $in: userIds } });
    return res.deletedCount;
  }

  // 批量删除后台用户
  async adminDeleteAdminUsers({ userIds }) {
    const res = await AdminUsers.deleteMany({ _id: { $in: userIds } });
    return res.deletedCount;
  }

  // 批量为用户添加删除标识
  async adminUpdateUsers({ userIds, type }) {
    await User.updateMany(
      { _id: { $in: userIds } },
      {
        $set: {
          isDelete: type ? true : false,
        },
      }
    );
    return userIds;
  }

  // 批量为后台用户添加删除标识
  async adminUpdateAdminUsers({ userIds, type }) {
    await AdminUsers.updateMany(
      { _id: { $in: userIds } },
      {
        $set: {
          isDelete: type ? true : false,
        },
      }
    );
    return userIds;
  }

  async adminFindMenus({ userId }) {
    const res = await Menus.findOne(
      { userId },
      { id: "$_id", _id: 0, menus: 1 }
    );
    return res;
  }

  // 设置为博主
  async adminSetAuth({ auth, userId, menus }) {
    await User.updateOne({ auth }, { $unset: { auth } });
    const data = await User.updateOne(
      { _id: userId },
      { $set: { auth, menus, updateTime: new Date().valueOf() } }
    );
    const menu = await new UserServer().adminFindMenus({ userId });
    if (menu) {
      await Menus.updateOne({ userId }, { $set: { menus } });
    } else {
      await Menus.create({ userId, menus });
    }
    return data.modifiedCount;
  }

  // 设置后台账号权限
  async adminSetAdminUserAuth({ auth, userId }) {
    await AdminUsers.updateOne({ auth }, { $unset: { auth } });
    const data = await AdminUsers.updateOne(
      { _id: userId },
      { $set: { auth } }
    );
    return data.modifiedCount;
  }

  // 前后台账户绑定
  async bindAccount({ userId, usernames }) {
    const findUsers = await User.find(
      { username: { $in: usernames } },
      { username: 1 }
    );

    const findUsernames = findUsers.map((i) => i.username);
    const findUserIds = findUsers.map((i) => i._id);
    const notFindUsers = usernames.filter((i) => !findUsernames.includes(i));

    if (notFindUsers.length) {
      return {
        notFindUsers,
        findUsernames,
        bindUserIds: findUserIds,
      };
    }

    // const bindedUser = await AdminUsers.findOne(
    //   {
    //     bindUserIds: { $in: findUserIds },
    //   },
    //   { username: 1 }
    // );

    // if (bindedUser?.username) {
    //   return {
    //     notFindUsers,
    //     findUsernames,
    //     bindUserIds: findUserIds,
    //     bindedUsername: bindedUser.username,
    //   };
    // }

    await AdminUsers.updateOne(
      { _id: userId },
      {
        $set: {
          bindUserIds: findUserIds,
        },
      }
    );

    await User.updateMany(
      { username: { $in: usernames } },
      {
        $set: {
          bindUserId: userId,
        },
      }
    );

    return {
      notFindUsers,
      findUsernames,
      bindUserIds: findUserIds,
    };
  }

  // 查找绑定的前台账号列表
  async findBindUsers({ userIds }) {
    const res = await User.find(
      {
        _id: { $in: userIds },
      },
      {
        username: 1,
        userId: "$_id",
        _id: 0,
      }
    );

    return res;
  }

  // 获取博主信息
  async findAuthorInfo() {
    const authorInfo = await User.find(
      {
        auth: 1,
      },
      {
        ...userFields,
        id: "$_id",
      }
    );

    const articles = await Article.find(
      { authorId: { $in: [authorInfo[0]?.id] }, isDelete: { $nin: [true] } },
      { id: "$_id", _id: 0, title: 1, coverImage: 1 }
    ).sort({ createTime: -1 });

    const articleInfo = {
      newArticle: articles[0],
      articleTotal: articles.length,
    };

    return { authorInfo: authorInfo?.[0], articleInfo };
  }
}

module.exports = new UserServer();
