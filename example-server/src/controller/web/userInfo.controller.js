const {
  getMyArticleList,
  getLikeArticleList,
  findOneUser,
  getTimelineList,
  checkLikeStatus,
} = require("../../service");
const { databaseError } = require("../../constant");

class userInfoController {
  // 获取我的文章
  async getMyArticleListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      // accessUserId有值，说明是访问别人的主页，需要通过accessUserId去获取点赞状态
      await checkLikeStatus(params.accessUserId);
      const res = await getMyArticleList(params);
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取文章列表成功",
        data: res,
      };
    } catch (error) {
      console.error("getMyArticleListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取点赞的文章
  async getLikeArticleListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      // const { pageNo, pageSize, userId } = ctx.request.body;
      await checkLikeStatus(params.userId);
      // 操作数据库
      const res = await getLikeArticleList(params);
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取文章列表成功",
        data: res,
      };
    } catch (error) {
      console.error("getLikeArticleListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取博主文章列表：accessUserId 需要进行点赞状态比较的 userId，比如 a 进入了 博主页面，那么 accessUserId 就是 a 的 userId
  async getAuthorArticleListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      await checkLikeStatus(params?.accessUserId);
      // 查询 auth 为1 的博主信息
      const authorInfo = await findOneUser({ auth: 1 });
      // accessUserId有值，说明是访问别人的主页，需要通过accessUserId去获取点赞状态
      const filterKey = {
        ...params,
        userId: authorInfo?._id?.toString(),
      };
      const res = await getMyArticleList(filterKey);

      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取文章列表成功",
        data: res,
      };
    } catch (error) {
      console.error("getAuthorArticleListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取博主点赞的文章
  async getAuthorLikeArticlesCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      // const { pageNo, pageSize, accessUserId } = ctx.request.body;
      await checkLikeStatus(params?.accessUserId);
      // 查询 auth 为1 的博主信息
      const authorInfo = await findOneUser({ auth: 1 });
      // 操作数据库
      const res = await getLikeArticleList({
        ...params,
        userId: authorInfo?._id?.toString(),
        // accessUserId: params?.accessUserId,
      });
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取文章列表成功",
        data: res,
      };
    } catch (error) {
      console.error("getAuthorLikeArticlesCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取博主文章时间轴
  async getAuthorTimelineCtr(ctx, next) {
    try {
      const { pageNo, pageSize, accessUserId } = ctx.request.body;
      await checkLikeStatus(accessUserId);
      // 查询 auth 为1 的博主信息
      const authorInfo = await findOneUser({ auth: 1 });
      // 操作数据库
      const res = await getTimelineList({
        pageNo,
        pageSize,
        userId: authorInfo?._id?.toString(),
        accessUserId,
        isAuthor: true,
      });
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取时间轴列表成功",
        data: res,
      };
    } catch (error) {
      console.error("getAuthorTimelineCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new userInfoController();
