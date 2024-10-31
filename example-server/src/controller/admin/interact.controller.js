const {
  getInteractsWithTotal,
  removeInteracts,
  delInteracts,
  restoreInteracts,
} = require("../../service");
const { databaseError } = require("../../constant");

class adminInteractController {
  // 分页获取留言列表
  async adminGetInteractListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      // 操作数据库
      const res = await getInteractsWithTotal({ ...params, isAdmin: true });
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取成功",
        data: res,
      };
    } catch (error) {
      console.error("adminGetInteractListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 移除留言
  async adminRemoveInteractsCtr(ctx, next) {
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
      console.error("adminRemoveInteractsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 恢复留言
  async adminRestoreInteractsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await restoreInteracts(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "恢复成功",
        data: res,
      };
    } catch (error) {
      console.error("adminRestoreInteractsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 彻底删除留言
  async adminDelInteractsCtr(ctx, next) {
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
      console.error("adminDelInteractsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new adminInteractController();
