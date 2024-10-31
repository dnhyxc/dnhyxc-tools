const {
  getClassifyList,
  getTagList,
  getTimelineList,
  checkLikeStatus,
  getAddedClassifys
} = require("../../service");
const { databaseError, userFormateError } = require("../../constant");

class classifyController {
  // 获取文章分类
  async getClassifyListCtr(ctx, next) {
    try {
      const { pageNo, pageSize, classify, userId, filter } = ctx.request.body;
      if (!classify) {
        return ctx.app.emit("error", userFormateError, ctx);
      }
      // 操作数据库
      const res = await getClassifyList({
        pageNo,
        pageSize,
        classify,
        userId,
        filter, // 搜索关键词
      });
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取分类列表成功",
        data: res,
      };
    } catch (error) {
      console.error("getClassifyListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
  // 获取文章分类、标签列表
  async getTagListCtr(ctx, next) {
    try {
      const { pageNo, pageSize, type } = ctx.request.body;
      // 操作数据库
      const res = await getTagList({ pageNo, pageSize, type });
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取成功",
        data: res,
      };
    } catch (error) {
      console.error("getTagListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
  // 获取文章时间轴
  async getTimelineListCtr(ctx, next) {
    try {
      const { pageNo, pageSize, userId } = ctx.request.body;
      await checkLikeStatus(userId);
      // 操作数据库
      const res = await getTimelineList({ pageNo, pageSize, userId });
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取时间轴列表成功",
        data: res,
      };
    } catch (error) {
      console.error("getTimelineListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
  // 获取后台添加的文章列表
  async getAddedClassifysCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getAddedClassifys(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取分类成功",
        data: res,
      };
    } catch (error) {
      console.error("getAddedClassifysCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new classifyController();
