const {
  saveResumeInfo,
  updateResumeInfo,
  deleteResumeInfo,
  getResumeInfoList,
  getResumeInfo,
} = require("../../service");
const { databaseError } = require("../../constant");

class ResumeController {
  async saveResumeInfoCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await saveResumeInfo(params);
      ctx.body = {
        code: 200,
        success: true,
        message: '保存配置成功',
        data: res._id,
        createTime: new Date().valueOf(),
      };
    } catch (error) {
      console.error("saveResumeInfoCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async updateResumeInfoCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await updateResumeInfo({ ...params, createTime: new Date().valueOf() });
      ctx.body = {
        code: 200,
        success: true,
        message: '更新配置成功',
        data: {
          id: res._id,
          ...params,
          createTime: res.createTime,
        },
      };
    } catch (error) {
      console.error("updateResumeInfoCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async deleteResumeInfoCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      await deleteResumeInfo(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "删除成功",
        data: params.id,
      };
    } catch (error) {
      console.error("deleteResumeInfoCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async getResumeInfoCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getResumeInfo(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取简历信息成功",
        data: res,
      };
    } catch (error) {
      console.error("getResumeInfoCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async getResumeInfoListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getResumeInfoList(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取配置列表成功",
        data: res,
      };
    } catch (error) {
      console.error("getResumeInfoListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new ResumeController();
