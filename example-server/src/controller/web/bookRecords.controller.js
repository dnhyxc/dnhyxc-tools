const {
  createReadBookRecords,
  getReadBookRecords,
  deleteReadBookRecords,
} = require("../../service");
const { databaseError } = require("../../constant");

class bookRecordsController {
  // 添加读书记录
  async createReadBookRecordsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      await createReadBookRecords(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "操作成功",
      };
    } catch (error) {
      console.error("createReadBookRecordsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取读书记录
  async getReadBookRecordsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getReadBookRecords(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取成功",
        data: res,
      };
    } catch (error) {
      console.error("getReadBookRecordsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 删除读书记录
  async deleteReadBookRecordsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await deleteReadBookRecords(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "删除成功",
        data: res,
      };
    } catch (error) {
      console.error("deleteReadBookRecordsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new bookRecordsController();
