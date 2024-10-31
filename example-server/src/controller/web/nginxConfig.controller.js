const {
  saveNginxConfig,
  deleteNginxConfig,
  getNginxConfigList,
  updateNginxConfig
} = require("../../service");
const { databaseError } = require("../../constant");

class NginxConfigController {
  async saveNginxConfigCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await saveNginxConfig(params);
      ctx.body = {
        code: 200,
        success: true,
        message: params.id ? '更新配置成功' : '保存配置成功',
        data: res._id,
      };
    } catch (error) {
      console.error("saveNginxConfigCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async updateNginxConfigCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await updateNginxConfig(params);
      ctx.body = {
        code: 200,
        success: true,
        message: '更新配置成功',
        data: {
          id: res._id,
          abstract: params.abstract
        },
      };
    } catch (error) {
      console.error("updateNginxConfigCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async deleteNginxConfigCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      await deleteNginxConfig(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "删除成功",
        data: params.id,
      };
    } catch (error) {
      console.error("deleteNginxConfigCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async getNginxConfigListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getNginxConfigList(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取配置列表成功",
        data: res,
      };
    } catch (error) {
      console.error("getNginxConfigListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new NginxConfigController();
