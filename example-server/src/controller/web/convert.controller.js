const {
  createConvert,
  deleteConvert,
  getConvertList,
} = require("../../service");
const { databaseError } = require("../../constant");

class convertController {
  // 创建转换列表
  async createConvertCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await createConvert(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "添加成功",
        data: res._id,
      };
    } catch (error) {
      console.error("createConvertCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取转换列表
  async getConvertListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getConvertList(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取成功",
        data: res,
      };
    } catch (error) {
      console.error("getConvertListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 删除转换列表
  async deleteConvertCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await deleteConvert(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "删除成功",
        data: res,
      };
    } catch (error) {
      console.error("deleteConvertCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new convertController();
