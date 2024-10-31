const { databaseError } = require("../../constant");
const {
  adminCreateConfig,
  adminFindTheme,
  adminCreateThemes,
  adminGetThemesWithTotal,
} = require("../../service");

class PageConfigController {
  async adminCreateConfigCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      await adminCreateConfig(params);
      ctx.body = {
        code: 200,
        message: "主题设置成功",
        success: true,
        data: params.bindUserIds,
      };
    } catch (error) {
      console.error("adminCreateConfigCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 创建主题信息
  async adminCreateThemesCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const findOne = await adminFindTheme(params);
      if (findOne) {
        ctx.body = {
          code: 201,
          message: "该主题已存在",
          success: true,
          data: params.uid,
        };
      } else {
        const res = await adminCreateThemes(params);
        ctx.body = {
          code: 200,
          message: "添加主题成功",
          success: true,
          data: res._id,
        };
      }
    } catch (error) {
      console.error("adminCreateThemesCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取主题信息列表
  async adminGetThemesCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await adminGetThemesWithTotal(params);
      ctx.body = {
        code: 200,
        message: "获取主题列表成功",
        success: true,
        data: res,
      };
    } catch (error) {
      console.error("adminGetThemesCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new PageConfigController();
