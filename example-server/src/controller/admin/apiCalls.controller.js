const { databaseError } = require("../../constant");
const { adminGetApiCallsTotal, adminGetApiCallsTotalByDay, adminGetApiCalledList } = require("../../service");

class adminApiCallsController {
  async adminGetApiCallsTotalCtr(ctx, next) {
    try {
      const res = await adminGetApiCallsTotal();
      ctx.body = {
        code: 200,
        message: "获取成功",
        success: true,
        data: res,
      };
    } catch (error) {
      console.error("adminGetApiCallsTotalCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
  async adminGetApiCallsTotalByDayCtr(ctx, next) {
    try {
      const res = await adminGetApiCallsTotalByDay();
      ctx.body = {
        code: 200,
        message: "获取成功",
        success: true,
        data: res,
      };
    } catch (error) {
      console.error("adminGetApiCallsTotalByDayCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async adminGetApiCalledListCtr(ctx, next) {
    try {
      const res = await adminGetApiCalledList();
      ctx.body = {
        code: 200,
        message: "获取成功",
        success: true,
        data: res,
      };
    } catch (error) {
      console.error("adminGetApiCalledListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new adminApiCallsController();
