const {
  getChatListWithTotal,
  deleteChats,
  mergeChats,
  updateNewChat,
  deleteNewChat,
  deleteCatchChat,
  getUnReadChat,
  getCacheChats,
  deleteChatMesaage,
  findDelContactChats,
  findDelChats,
  findDelCatchChats,
  findDelNewChats,
} = require("../../service");
const { removeAtlasImage } = require("./upload.controller");
const { databaseError } = require("../../constant");

class codesController {
  // 获取聊天列表
  async getChatListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getChatListWithTotal(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取成功",
        data: res,
      };
    } catch (error) {
      console.error("getChatListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 合并消息
  async mergeChatsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await mergeChats(params);
      ctx.body = {
        code: 200,
        success: true,
        data: {
          noReadCount: res.length,
        },
      };
    } catch (error) {
      console.error("mergeChatsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 更新最新消息消息
  async updateNewChatCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      await updateNewChat(params);
      ctx.body = {
        code: 200,
        data: params.chatId,
        message: "更新成功",
        success: true,
      };
    } catch (error) {
      console.error("updateNewChatCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 更新最新消息消息
  async deleteNewChatCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const delUrls = await findDelNewChats(params);
      await removeAtlasImage(delUrls);
      await deleteNewChat(params);
      ctx.body = {
        code: 200,
        data: params.chatId,
        message: "删除成功",
        success: true,
      };
    } catch (error) {
      console.error("deleteNewChatCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 删除缓存消息
  async deleteCatchChatCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const delUrls = await findDelCatchChats(params);
      await removeAtlasImage(delUrls);
      await deleteCatchChat(params);
      ctx.body = {
        code: 200,
        data: params.chatId,
        message: "删除成功",
        success: true,
      };
    } catch (error) {
      console.error("deleteCatchChatCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取未读消息
  async getUnReadChatCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getUnReadChat(params);
      ctx.body = {
        code: 200,
        success: true,
        data: {
          noReadCount: res.length,
        },
      };
    } catch (error) {
      console.error("getUnReadChatCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取缓存消息
  async getCacheChatsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getCacheChats(params);
      ctx.body = {
        code: 200,
        success: true,
        data: res,
      };
    } catch (error) {
      console.error("getCacheChatsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 删除聊天
  async deleteChatsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const delUrls = await findDelChats(params);
      await removeAtlasImage(delUrls);
      const res = await deleteChats(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "删除成功",
        data: res,
      };
    } catch (error) {
      console.error("deleteChatsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 删除联系人时，清空聊天记录
  async deleteChatMesaageCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const delUrls = await findDelContactChats(params);
      // 删除聊天时，删除其中的图片资源
      await removeAtlasImage(delUrls);
      const res = await deleteChatMesaage(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "删除成功",
        data: res,
      };
    } catch (error) {
      console.error("deleteChatMesaageCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new codesController();
