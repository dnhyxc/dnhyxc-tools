const {
  getMessageList,
  setMessageOfReaded,
  getNoReadMsgCount,
  deleteMessage,
  deleteAllMessage,
} = require("../../service");
const { databaseError } = require("../../constant");

class messageController {
  // 获取消息列表
  async getMessageListCtr(ctx, next) {
    try {
      const { pageNo, pageSize, userId } = ctx.request.body;
      // 操作数据库
      const res = await getMessageList({ pageNo, pageSize, userId });
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取成功",
        data: res,
      };
    } catch (error) {
      console.error("getTagListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 设置消息已读
  async setReadStatusCtr(ctx, next) {
    try {
      const { userId, msgIds } = ctx.request.body;
      // 操作数据库
      const res = await setMessageOfReaded({ userId, msgIds });
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "消息已置为已读",
        data: res,
      };
    } catch (error) {
      console.error("setReadStatusCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取未读消息数
  async getNoReadMsgCountCtr(ctx, next) {
    try {
      const { userId } = ctx.request.body;
      // 操作数据库
      const res = await getNoReadMsgCount({ userId });
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取未读消息数成功",
        data: res,
      };
    } catch (error) {
      console.error("getNoReadMsgCountCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 设置消息已读
  async deleteMessageCtr(ctx, next) {
    try {
      const { userId, id } = ctx.request.body;
      // 操作数据库
      await deleteMessage({ userId, id });
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "消息删除成功",
        data: id,
      };
    } catch (error) {
      console.error("deleteMessageCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 删除全部消息
  async deleteAllMessageCtr(ctx, next) {
    try {
      const { userId } = ctx.request.body;
      // 操作数据库
      const res = await deleteAllMessage({ userId });
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "消息删除成功",
        data: res.modifiedCount,
      };
    } catch (error) {
      console.error("deleteAllMessageCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new messageController();
