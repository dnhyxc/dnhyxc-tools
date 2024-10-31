const { Interact } = require("../../models");

class interactServer {
  // 发布留言
  async createInteract(params) {
    await Interact.create({
      ...params,
      createTime: new Date().valueOf(),
    });
  }

  // 获取留言
  async getInteracts(params) {
    const res = await Interact.find(
      { isDelete: { $nin: [true] } },
      {
        id: "$_id",
        _id: 0,
        userId: 1,
        username: 1,
        avatar: 1,
        createTime: 1,
        comment: 1,
      }
    )
      .sort({
        createTime: -1,
      })
      .limit(300);

    return res;
  }

  // 分页获取留言列表
  async getInteractsWithTotal({ pageNo, pageSize, isAdmin }) {
    const matchParams = isAdmin ? {} : { isDelete: { $nin: [true] } };

    const project = {
      id: "$_id",
      _id: 0,
      userId: 1,
      username: 1,
      createTime: 1,
      comment: 1,
      avatar: 1,
      isDelete: 1,
    };

    if (!isAdmin) {
      delete project.isDelete;
    }

    const list = await Interact.aggregate([
      { $match: matchParams },
      {
        $facet: {
          total: [{ $count: "count" }],
          data: [
            {
              $project: project,
            },
            {
              $sort: { createTime: -1 },
            },
            { $skip: (pageNo - 1) * pageSize },
            { $limit: pageSize },
          ],
        },
      },
    ]);

    if (list?.length) {
      const { total, data } = list[0];
      return {
        total: total[0]?.count || 0,
        list: data || [],
      };
    } else {
      return {
        total: 0,
        list: [],
      };
    }
  }

  // 修改留言用户信息
  async updateInteracts(params) {
    const res = await Interact.updateMany(
      {
        userId: params.userId,
      },
      {
        $set: {
          username: params.username,
          avatar: params.headUrl,
        },
      }
    );

    return res;
  }

  // 移除留言
  async removeInteracts({ ids }) {
    const filters = Array.isArray(ids) ? ids : [ids];

    const params = filters.length
      ? {
          _id: { $in: filters },
        }
      : {};

    const res = await Interact.updateMany(params, {
      $set: {
        isDelete: true,
      },
    });

    return res.modifiedCount;
  }

  // 移除所有留言
  async removeAllInteracts() {
    const res = await Interact.updateMany(
      {
        _id: { $in: filters },
      },
      {
        $set: {
          isDelete: true,
        },
      }
    );

    return res.modifiedCount;
  }

  // 显示留言
  async restoreInteracts({ ids }) {
    const filters = Array.isArray(ids) ? ids : [ids];

    const res = await Interact.updateMany(
      {
        _id: { $in: filters },
      },
      {
        $set: {
          isDelete: false,
        },
      }
    );

    return res.modifiedCount;
  }

  // 彻底删除
  async delInteracts({ ids }) {
    const filters = Array.isArray(ids) ? ids : [ids];

    const res = await Interact.deleteMany({
      _id: { $in: filters },
    });

    return res.modifiedCount;
  }
}

module.exports = new interactServer();
