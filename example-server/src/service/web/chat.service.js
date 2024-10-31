const { Chat, CacheChats, NewChats } = require("../../models");

class chatServer {
  // 添加聊天
  addChat = async ({ from, to, content, chatId, createTime, replyInfo }) => {
    const chat = [
      {
        userId: from,
        chat: {
          from,
          to,
          content,
          chatId,
          createTime,
          replyInfo,
        },
      },
      {
        userId: to,
        chat: {
          from,
          to,
          content,
          chatId,
          createTime,
          replyInfo,
        },
      },
    ];

    const res = await CacheChats.create(chat);
    this.addNewChat(chat);
    return res;
  };

  // 添加最新聊天
  addNewChat = async (params) => {
    const finds = await NewChats.find({
      "chat.chatId": params[0]?.chat?.chatId,
    });

    if (finds.length === 2) {
      await NewChats.updateMany(
        { "chat.chatId": params[0]?.chat?.chatId },
        {
          $set: {
            chat: params[0]?.chat,
          },
        }
      );
    } else if (finds.length === 1) {
      // 如果只找到一个,则先将其删除再重新创建
      await NewChats.deleteOne({ "chat.chatId": finds[0]?.chat.chatId });
      await NewChats.create(params);
    } else {
      await NewChats.create(params);
    }
  };

  // 更新最新消息
  updateNewChat = async ({ chat, userId }) => {
    const res = await NewChats.updateMany(
      { userId, "chat.chatId": chat.chatId },
      {
        $set: {
          chat,
        },
      }
    );
    return res;
  };

  // 删除缓存及最新消息
  deleteChatMesaage = async ({ chatId, userId }) => {
    const res = await Promise.all([
      this.deleteNewChat({ chatId, userId }),
      this.deleteCatchChats({ chatId, userId }),
      this.deleteChatsByUserId({ chatId, userId }),
    ]);
    return {
      delNewChatCount: res[0]?.deletedCount,
      delCatchChat: res[1]?.deletedCount,
      delChatCount: res[2]?.deletedCount,
    };
  };

  // 查找要删除的消息列表
  findDelContactChats = async ({ chatId, userId }) => {
    const res = await Promise.all([
      NewChats.find(
        { userId, "chat.chatId": chatId },
        { _id: 0, id: "$_id", userId: 1, chat: 1 }
      ),
      CacheChats.find(
        { userId, "chat.chatId": chatId },
        { _id: 0, id: "$_id", userId: 1, chat: 1 }
      ),
      Chat.find(
        { userId, "chat.chatId": chatId },
        { _id: 0, id: "$_id", userId: 1, chat: 1 }
      ),
    ]);
    const chats = [...res[0], ...res[1], ...res[2]];
    const imgUrls = this.getDelChatUrls(chats);
    return imgUrls;
  };

  // 删除最新消息
  deleteNewChat = async ({ chatId, userId }) => {
    const res = await NewChats.deleteMany({ userId, "chat.chatId": chatId });
    return res;
  };

  // 根据userId和chatId删除缓存聊天
  deleteCatchChats = async ({ chatId, userId }) => {
    const res = await CacheChats.deleteMany({ userId, "chat.chatId": chatId });
    return res;
  };

  // 根据userId和chatId删除缓存聊天
  deleteChatsByUserId = async ({ chatId, userId }) => {
    const res = await Chat.deleteMany({ userId, "chat.chatId": chatId });
    return res;
  };

  // 删除缓存聊天记录
  deleteCatchChat = async ({ id, userId }) => {
    const res = await CacheChats.deleteOne({ userId, _id: id });
    return res;
  };

  // 获取最新聊天
  getNewChat = async (chatIds, userId) => {
    const res = await NewChats.find(
      { userId, "chat.chatId": { $in: chatIds } },
      {
        _id: 0,
        id: "$_id",
        userId: 1,
        chat: 1,
      }
    );
    return res;
  };

  // 获取新增的缓存消息
  getCacheChats = async ({ chatId, userId }) => {
    const chatIds = Array.isArray(chatId) ? chatId : [chatId];
    const match = userId
      ? { userId, "chat.chatId": { $in: chatIds } }
      : { "chat.chatId": { $in: chatIds } };
    const res = await CacheChats.find(match, {
      _id: 0,
      id: "$_id",
      userId: 1,
      chat: 1,
    });
    return res;
  };

  // 获取未读消息
  getUnReadChat = async ({ chatId, userId }) => {
    const res = await this.getCacheChats({ chatId, userId });
    return res;
  };

  // 合并消息列表
  mergeChats = async ({ chatId }) => {
    const chats = await this.getCacheChats({ chatId });
    if (chats?.length) {
      await Chat.insertMany(chats);
      await CacheChats.deleteMany({ "chat.chatId": chatId });
    }
    return [];
  };

  // 添加聊天
  createChat = async ({ from, to, content, chatId, createTime }) => {
    const res = await Chat.create({
      from,
      to,
      content,
      chatId,
      createTime,
    });
    return res;
  };

  // 删除聊天
  deleteChats = async ({ delIds }) => {
    const res = await Chat.deleteMany({ _id: { $in: delIds } });
    return res.deletedCount;
  };

  // 获取需要删除的图片链接
  getDelChatUrls = (chats) => {
    const imgUrls = [];
    chats.forEach((i) => {
      const regex = /<[^>]+>/g;
      const content = i.chat.content;
      const matches = content.match(regex);
      if (matches) {
        const link = matches?.map(
          (match) => match.substring(1, match.length - 1).split(",")[1]
        );
        imgUrls.push(...link);
      }
    });
    return imgUrls;
  };

  // 获取需要删除的聊天
  findDelChats = async ({ delIds }) => {
    const res = await Chat.find(
      { _id: { $in: delIds } },
      { _id: 0, id: "$_id", userId: 1, chat: 1 }
    );
    const imgUrls = this.getDelChatUrls(res);
    return imgUrls;
  };

  // 获取需要删除的聊天
  findDelCatchChats = async ({ id, userId }) => {
    const res = await CacheChats.find(
      { userId, _id: id },
      { _id: 0, id: "$_id", userId: 1, chat: 1 }
    );
    const imgUrls = this.getDelChatUrls(res);
    return imgUrls;
  };

  // 获取需要删除的聊天
  findDelNewChats = async ({ chatId, userId }) => {
    const res = await NewChats.find(
      { userId, "chat.chatId": chatId },
      { _id: 0, id: "$_id", userId: 1, chat: 1 }
    );
    const imgUrls = this.getDelChatUrls(res);
    return imgUrls;
  };

  // 分页获取聊天消息列表
  getChatListWithTotal = async ({ chatId, pageNo, pageSize, userId }) => {
    const list = await Chat.aggregate([
      { $match: { userId, "chat.chatId": chatId } },
      {
        $facet: {
          total: [{ $count: "count" }],
          data: [
            {
              $project: {
                _id: 0,
                id: "$_id",
                userId: 1,
                chat: 1,
              },
            },
            { $sort: { "chat.createTime": -1 } },
            { $skip: (pageNo - 1) * pageSize },
            { $limit: pageSize },
          ],
        },
      },
    ]);
    if (list?.length) {
      const { total, data } = list[0];
      const sortData = data.sort(
        (a, b) => a.chat.createTime - b.chat.createTime
      );
      return {
        total: total[0]?.count || 0,
        list: sortData || [],
      };
    } else {
      return {
        total: 0,
        list: [],
      };
    }
  };
}

module.exports = new chatServer();
