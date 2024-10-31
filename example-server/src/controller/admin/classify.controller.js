const { databaseError } = require("../../constant");
const {
  adminCreateClassify,
  adminUpdateClassify,
  adminDelClassifys,
  adminGetClassifyList,
  adminAddClassify,
} = require("../../service");

class adminClassifyController {
  // 创建分类
  async adminCreateClassifyCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await adminCreateClassify(params);
      ctx.body = {
        code: res ? 200 : 10002,
        message: res
          ? "分类创建成功"
          : `分类名称【${params.classifyName}】重复`,
        success: res ? true : false,
        data: res._id,
      };
    } catch (error) {
      console.error("adminCreateClassifyCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 更新分类
  async adminUpdateClassifyCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await adminUpdateClassify(params);
      ctx.body = {
        code: 200,
        message: "分类更新成功",
        success: true,
        data: res,
      };
    } catch (error) {
      console.error("adminUpdateClassifyCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 删除分类
  async adminDelClassifysCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await adminDelClassifys(params);
      ctx.body = {
        code: 200,
        message: "分类删除成功",
        success: true,
        data: res,
      };
    } catch (error) {
      console.error("adminDelClassifysCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 添加分类
  async adminAddClassifyCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await adminAddClassify(params);
      ctx.body = {
        code: 200,
        message: "分类添加成功",
        success: true,
        data: res,
      };
    } catch (error) {
      console.error("adminAddClassifyCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取分类
  async adminGetClassifyListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await adminGetClassifyList(params);
      ctx.body = {
        code: 200,
        message: "分类获取成功",
        success: true,
        data: res,
      };
    } catch (error) {
      console.error("adminGetClassifyListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new adminClassifyController();
