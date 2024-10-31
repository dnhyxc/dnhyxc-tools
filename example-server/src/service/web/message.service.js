const { Message } = require("../../models");

class messageServer {
  // 创建评论
  createMessage = async (message) => {
    // 查找
    const res = await Message.create({
      ...message,
      ...message?.data,
      pushDate: new Date().valueOf(), // 推送消息的时间
      isReaded: false,
      isRemove: false,
    });

    return res;
  };

  // 获取消息列表同时返回消息总条数
  getMessageListWithTotal = async ({ filterKey, pageNo, pageSize }) => {
    const list = await Message.aggregate([
      { $match: filterKey },
      {
        $facet: {
          total: [{ $count: "count" }],
          data: [
            {
              $project: {
                _id: 0, // 默认情况下_id是包含的，将_id设置为0|false，则选择不包含_id，其他字段也可以这样选择是否显示。
                id: "$_id", // 将_id更名为classify
                title: 1,
                authorId: 1,
                authorName: 1,
                pushDate: 1,
                fromUsername: 1,
                fromUserId: 1,
                action: 1,
                isReaded: 1,
                articleId: 1,
                isRemove: 1,
                toUserId: 1,
                from: 1,
                to: 1,
                content: 1,
                chatId: 1,
              },
            },
            {
              $sort: { pushDate: -1 },
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
        list: data,
      };
    } else {
      return {
        total: 0,
        list: [],
      };
    }
  };

  // 查询评论列表
  getMessageList = async ({ userId, pageNo, pageSize }) => {
    const res = this.getMessageListWithTotal({
      filterKey: { toUserId: userId, isRemove: { $ne: true } },
      pageNo,
      pageSize,
    });

    return res;
  };

  // 设置消息已读
  setMessageOfReaded = async ({ userId, msgIds }) => {
    const res = await Message.updateMany(
      {
        toUserId: userId,
        _id: { $in: msgIds },
      },
      {
        $set: { isReaded: true },
      }
    );
    return res.modifiedCount;
  };

  // 获取未读消息数量
  getNoReadMsgCount = async ({ userId }) => {
    const res = await Message.find(
      {
        toUserId: userId,
        isReaded: { $ne: true },
        isRemove: { $ne: true },
      },
      {
        id: "$_id",
        _id: 0,
        action: 1,
        articleId: 1,
        authorId: 1,
        authorName: 1,
        fromUserId: 1,
        fromUsername: 1,
        isReaded: 1,
        isRemove: 1,
        pushDate: 1,
        title: 1,
        toUserId: 1,
      }
    ).sort({ pushDate: -1 });

    return {
      count: res.length,
      list: res,
    };
  };

  // 删除消息
  deleteMessage = async ({ userId, id }) => {
    const res = await Message.updateOne(
      { toUserId: userId, _id: id },
      { $set: { isRemove: true } }
    );
    return res;
  };

  // 删除全部消息
  deleteAllMessage = async ({ userId }) => {
    const res = await Message.updateMany(
      { toUserId: userId, isRemove: { $ne: true } },
      { $set: { isRemove: true } }
    );
    return res;
  };
}

module.exports = new messageServer();
