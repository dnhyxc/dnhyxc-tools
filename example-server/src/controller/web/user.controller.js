const jwt = require("jsonwebtoken");
const { deleteFile } = require("./upload.controller");
const { databaseError, userNotExist } = require("../../constant");
const { JWT_SECRET } = require("../../config");
const {
  createUserServer,
  findOneUser,
  updateUser,
  logout,
  findUserById,
  getArticleTotal,
  updateAuthorName,
  updateInteracts,
  updateFollowUserInfo,
  adminFindMenus,
  updateCommentUserInfo,
  findPhone,
  verifyCode,
  checkVerifyCode,
} = require("../../service");
const WS = require("../../socket");

class UserController {
  // 随机返回验证码
  async getVerifyCodeCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await verifyCode(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取验证码成功",
        data: res,
      };
    } catch (error) {
      console.error("getVerifyCodeCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
  // 账号注册
  async registerCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const hashInfo = await findPhone(params);
      if (hashInfo?.hash) {
        ctx.body = {
          code: 201,
          success: false,
          message: "该手机号已被注册",
          data: null,
        };
      } else {
        const res = await createUserServer(params);
        ctx.body = {
          code: 200,
          message: "注册成功",
          success: true,
          data: res?.id,
        };
      }
    } catch (error) {
      console.error("registerCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 账号登录
  async loginCtr(ctx, next) {
    // 1. 获取用户信息（在token的playload中，记录id，username）
    try {
      const { username, codeId, code } = ctx.request.body;
      // 检验验证码
      const res = await checkVerifyCode({ codeId, code });
      if (res) {
        const { password, ...props } = (await findOneUser({ username })) || {};
        delete props?._doc.password;
        delete props?._doc._id;
        ctx.body = {
          code: 200,
          success: true,
          message: "登录成功",
          data: {
            ...props?._doc,
            token: jwt.sign(
              {
                _doc: {
                  username: props?._doc.username,
                  userId: props?._doc.userId,
                },
                time: new Date().getTime(),
                timeout: 1000 * 60 * 60 * 1,
              },
              JWT_SECRET,
              { expiresIn: "1d" }
            ),
          },
        };

        WS.singleSendMessage({
          action: "logout",
          userId: props._doc.userId.toString(),
          code: 200,
        });
      } else {
        ctx.body = {
          code: 406,
          success: false,
          message: "验证码错误",
        };
      }
    } catch (error) {
      console.error("loginCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取用户信息
  async getUserInfoCtr(ctx, next) {
    try {
      const { userId, auth, needTotal } = ctx.request.body;
      const authorInfo = auth && (await findOneUser({ auth: 1 }));

      let filter = "";
      if (auth) {
        filter = authorInfo?._id?.toString();
      } else {
        filter = userId;
      }

      const articleTotal =
        needTotal &&
        (await getArticleTotal({
          isDelete: { $nin: [true] },
          authorId: authorInfo?._id?.toString(),
        }));

      const res = await findUserById(filter);
      if (!res) {
        ctx.app.emit("error", userNotExist, ctx);
        return;
      }
      ctx.body = {
        code: 200,
        success: true,
        message: "获取用户信息成功",
        data: {
          ...res?._doc,
          articleTotal,
        },
      };
    } catch (error) {
      console.error("getUserInfo", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 更新用户信息
  async updateInfoCtr(ctx, next) {
    try {
      const { userId, ...params } = ctx.request.body;
      if (!userId) {
        ctx.app.emit("error", fieldFormateError, ctx);
        return;
      }
      const beforeUserInfo = await findUserById(userId);
      if (beforeUserInfo?.headUrl && params.headUrl !== beforeUserInfo.headUrl) {
        await deleteFile(beforeUserInfo.headUrl);
      }
      if (beforeUserInfo?.mainCover && params.mainCover !== beforeUserInfo.mainCover) {
        await deleteFile(beforeUserInfo.mainCover);
      }
      // 更新用户名称时，需要同时更新当前用户的所有文章中的作者名称
      await updateAuthorName(userId, params.username);
      const filter = { _id: userId };
      await updateUser(filter, params);
      await updateInteracts({ ...params, userId });
      await updateFollowUserInfo(userId, params);
      // 更新评论中的用户信息
      await updateCommentUserInfo({ ...params, userId });
      if (beforeUserInfo) {
        ctx.body = {
          code: 200,
          success: true,
          message: "修改成功",
          data: {
            ...beforeUserInfo._doc,
            ...params,
          },
        };
      }
    } catch (error) {
      console.error("updateInfoCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 重置密码
  async resetPwdCtr(ctx, next) {
    try {
      const { password, username } = ctx.request.body;
      if (!password || !username) {
        ctx.app.emit("error", fieldFormateError, ctx);
        return;
      }
      const filter = { username };
      await updateUser(filter, { password });
      const { ...props } = (await findOneUser({ username })) || {};
      delete props?._doc.password;
      delete props?._doc._id;
      ctx.body = {
        code: 200,
        success: true,
        message: "密码重置成功",
        data: props?._doc,
      };
    } catch (error) {
      console.error("resetPwdCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 校验token是否过期
  async verifyTokenCtr(ctx, next) {
    try {
      ctx.body = {
        code: 200,
        success: true,
        message: "effective",
        data: 1,
      };
    } catch (error) {
      console.error("verifyTokenCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 注销用户
  async logoutCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await logout(params);
      if (res) {
        ctx.body = {
          code: 200,
          success: true,
          message: "注销成功",
          data: params.userId,
        };
      } else {
        ctx.body = {
          code: 200,
          success: false,
          message: "注销失败",
          data: params.userId,
        };
      }
    } catch (error) {
      console.error("logout", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取菜单权限列表
  async findMenusCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await adminFindMenus(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取菜单权限成功",
        data: res,
      };
    } catch (error) {
      console.error("logout", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new UserController();
