const {
  findUserById,
  manageFollow,
  getFollowListWithTotal,
  getFollowMeListWithTotal,
  findFollowed,
} = require("../../service");
const { databaseError } = require("../../constant");

class followController {
  // 关注或者取消关注
  async manageFollowCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const userInfo = await findUserById(params.authorId);
      if (userInfo) {
        // 操作数据库
        const res = await manageFollow({
          userId: params.userId,
          followInfo: userInfo,
        });
        // 返回结果
        ctx.body = {
          code: 200,
          success: true,
          message: !res ? "取消关注成功" : "关注成功",
          data: {
            userId: userInfo._doc?.userId || res,
            isFollowed: res,
          },
        };
      } else {
        // 返回结果
        ctx.body = {
          code: 500,
          success: false,
          message: "操作失败",
          data: false,
        };
      }
    } catch (error) {
      console.error("manageFollowCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取关注列表
  async getFollowListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getFollowListWithTotal(params);
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取关注列表成功",
        data: res,
      };
    } catch (error) {
      console.error("getFollowListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取关注列表
  async getFollowMeListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getFollowMeListWithTotal(params);
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取关注列表成功",
        data: res,
      };
    } catch (error) {
      console.error("getFollowMeListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 查询是否已经关注
  async findFollowedCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await findFollowed(params);
      ctx.body = {
        code: 200,
        success: true,
        message: res ? "已经关注" : "暂未关注",
        data: res ? true : false,
      };
    } catch (error) {
      console.error("updateFollowUserInfoCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new followController();
