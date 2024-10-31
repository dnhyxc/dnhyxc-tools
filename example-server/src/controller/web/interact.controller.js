const {
  createInteract,
  getInteracts,
  getInteractsWithTotal,
  removeInteracts,
  delInteracts,
} = require("../../service");
const { databaseError } = require("../../constant");

class interactController {
  // 创建留言
  async createInteractCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      // 操作数据库
      await createInteract(params);
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "发表成功",
        data: params.userId,
      };
    } catch (error) {
      console.error("createInteractCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取留言列表
  async getInteractsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      // 操作数据库
      const res = await getInteracts(params);
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取成功",
        data: res,
      };
    } catch (error) {
      console.error("getInteractsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 分页获取留言列表
  async getInteractListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      // 操作数据库
      const res = await getInteractsWithTotal(params);
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取成功",
        data: res,
      };
    } catch (error) {
      console.error("getInteractsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 移除留言
  async removeInteractsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await removeInteracts(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "移除成功",
        data: res,
      };
    } catch (error) {
      console.error("removeInteractsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 彻底删除留言
  async delInteractsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await delInteracts(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "删除成功",
        data: res,
      };
    } catch (error) {
      console.error("delInteractsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new interactController();
