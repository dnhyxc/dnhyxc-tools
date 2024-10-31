const jwt = require("jsonwebtoken");
const { deleteFiles, deleteFile } = require("../web/upload.controller");
const { databaseError, userNotExist } = require("../../constant");
const { JWT_SECRET } = require("../../config");
const {
  adminCreateUserServer,
  adminFindOneUser,
  adminFindWebUsers,
  adminFindAdminUsers,
  adminFindUserById,
  adminUpdateUser,
  adminGetArticleTotal,
  adminGetUserList,
  adminGetAdminUserList,
  adminUpdateUsers,
  adminDeleteAdminUsers,
  adminUpdateAdminUsers,
  adminBatchDeleteUser,
  adminSetAuth,
  adminFindMenus,
  adminSetAdminUserAuth,
  bindAccount,
  findBindUsers,
  findAuthorInfo,
  adminVerifyCode,
  adminCheckVerifyCode,
} = require("../../service");

class UserController {
  // 随机返回验证码
  async adminGetVerifyCodeCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await adminVerifyCode(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取验证码成功",
        data: res,
      };
    } catch (error) {
      console.error("adminGetVerifyCodeCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
  async adminRegisterCtr(ctx, next) {
    try {
      const { username, password } = ctx.request.body;
      const res = await adminCreateUserServer({ username, password });
      ctx.body = {
        code: 200,
        message: "注册成功",
        success: true,
        data: res?.id,
      };
    } catch (error) {
      console.error("registerCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async adminLoginCtr(ctx, next) {
    // 1. 获取用户信息（在token的playload中，记录id，username）
    try {
      const { username, codeId, code } = ctx.request.body;
      // 检验验证码
      const res = await adminCheckVerifyCode({ codeId, code });
      if (res) {
        const { password, ...props } =
          (await adminFindOneUser({ username })) || {};
        delete props?._doc.password;
        delete props?._doc._id;
        ctx.body = {
          code: 201,
          success: true,
          message: "登录成功",
          data: {
            ...props?._doc,
            token: jwt.sign(props, JWT_SECRET, { expiresIn: "1d" }),
          },
        };
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
  async adminGetUserInfoCtr(ctx, next) {
    try {
      const { userId, auth, needTotal } = ctx.request.body;
      const authorInfo = auth && (await adminFindOneUser({ auth: 1 }));

      let filter = "";
      if (auth) {
        filter = authorInfo?._id?.toString();
      } else {
        filter = userId;
      }
      const articleTotal =
        needTotal &&
        (await adminGetArticleTotal({
          isDelete: { $nin: [true] },
          authorId: authorInfo?._id?.toString(),
        }));

      const res = await adminFindUserById(filter);

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

  // 重置密码
  async adminResetPwdCtr(ctx, next) {
    try {
      const { password, username } = ctx.request.body;
      if (!password || !username) {
        ctx.app.emit("error", fieldFormateError, ctx);
        return;
      }
      const filter = { username };
      await adminUpdateUser(filter, { password });
      const { ...props } = (await adminFindOneUser({ username })) || {};
      delete props?._doc.password;
      delete props?._doc._id;
      ctx.body = {
        code: 200,
        success: true,
        message: "密码重置成功",
        data: props?._doc,
      };
    } catch (error) {
      console.error("adminResetPwdCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 更新用户信息
  async adminUpdateInfoCtr(ctx, next) {
    try {
      const { userId, ...params } = ctx.request.body;
      if (!userId) {
        ctx.app.emit("error", fieldFormateError, ctx);
        return;
      }
      const beforeUserInfo = await adminFindUserById(userId);
      if (beforeUserInfo.headUrl && params.headUrl !== beforeUserInfo.headUrl) {
        await deleteFile(beforeUserInfo.headUrl)
      }
      await adminUpdateUser({ _id: userId }, params);
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
      console.error("adminUpdateInfoCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 校验token是否过期
  async adminVerifyTokenCtr(ctx, next) {
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

  // 获取前台用户列表
  async adminGetUserListCtr(ctx, next) {
    try {
      const { pageNo, pageSize, keyword } = ctx.request.body;
      const res = await adminGetUserList({
        pageNo,
        pageSize,
        keyword,
      });
      ctx.body = {
        code: 200,
        success: true,
        message: "用户列表获取成功",
        data: res,
      };
    } catch (error) {
      console.error("adminGetUserListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取后台用户列表
  async adminGetAdminUserListCtr(ctx, next) {
    try {
      const { pageNo, pageSize } = ctx.request.body;
      const res = await adminGetAdminUserList({ pageNo, pageSize });
      ctx.body = {
        code: 200,
        success: true,
        message: "用户列表获取成功",
        data: res,
      };
    } catch (error) {
      console.error("adminGetAdminUserListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 批量为用户设置删除标识
  async adminUpdateUsersCtr(ctx, next) {
    try {
      const { userIds, type } = ctx.request.body;
      const res = await adminUpdateUsers({ userIds, type });
      ctx.body = {
        code: 200,
        success: true,
        message: type ? "作废成功" : "恢复成功",
        data: res,
      };
    } catch (error) {
      console.error("adminUpdateUsersCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 批量为后台用户设置删除标识
  async adminUpdateAdminUsersCtr(ctx, next) {
    try {
      const { userIds, type } = ctx.request.body;
      const res = await adminUpdateAdminUsers({ userIds, type });
      ctx.body = {
        code: 200,
        success: true,
        message: type ? "作废成功" : "恢复成功",
        data: res,
      };
    } catch (error) {
      console.error("adminUpdateAdminUsersCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 批量删除前台用户
  async adminBatchDeleteUserCtr(ctx, next) {
    try {
      const { userIds } = ctx.request.body;
      const users = await adminFindWebUsers(userIds);
      const urls = [];
      const deleteRes = await new Promise(async (resolve, reject) => {
        users.forEach(user => {
          if (user.headUrl) {
            urls.push(user.headUrl);
          }
          if (user.mainCover) {
            urls.push(user.mainCover);
          }
        })
        try {
          await deleteFiles(urls);
          resolve(1)
        } catch (error) {
          reject(0)
        }
      })
      if (deleteRes === 0) {
        ctx.body = {
          code: 500,
          success: false,
          message: "清除账号信息失败",
        };
      } else {
        const res = await adminBatchDeleteUser({ userIds });
        ctx.body = {
          code: 200,
          success: true,
          message: "删除成功",
          data: res,
        };
      }
    } catch (error) {
      console.error("adminBatchDeleteUserCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 批量删除后台用户
  async adminDeleteAdminUsersCtr(ctx, next) {
    try {
      const { userIds } = ctx.request.body;
      const users = await adminFindAdminUsers(userIds);
      const urls = [];
      const deleteRes = await new Promise(async (resolve, reject) => {
        users.forEach(user => {
          if (user.headUrl) {
            urls.push(user.headUrl);
          }
        })
        try {
          await deleteFiles(urls);
          resolve(1)
        } catch (error) {
          reject(0)
        }
      })

      if (deleteRes === 0) {
        ctx.body = {
          code: 500,
          success: false,
          message: "清除账号信息失败",
        };
      } else {
        const res = await adminDeleteAdminUsers({ userIds });
        ctx.body = {
          code: 200,
          success: true,
          message: "删除成功",
          data: res,
        };
      }
    } catch (error) {
      console.error("adminDeleteAdminUsersCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 设置权限
  async adminSetAuthCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      await adminSetAuth(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "权限设置成功",
        data: params.userId,
      };
    } catch (error) {
      console.error("adminSetAuthCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取菜单权限
  async adminFindMenusCtr(ctx, next) {
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
      console.error("adminFindMenusCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 设置后台账号权限
  async adminSetAdminUserAuthCtr(ctx, next) {
    try {
      const { auth, userId } = ctx.request.body;
      await adminSetAdminUserAuth({ auth, userId });
      ctx.body = {
        code: 200,
        success: true,
        message: "权限设置成功",
        data: userId,
      };
    } catch (error) {
      console.error("adminSetAdminUserAuthCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 绑定账户
  async bindAccountCtr(ctx, next) {
    try {
      const { userId, usernames } = ctx.request.body;
      const res = await bindAccount({ userId, usernames });

      if (res.notFindUsers.length) {
        ctx.body = {
          code: 201,
          success: false,
          message: `绑定失败 ${res.notFindUsers.join("，")} 账号不存在`,
          data: res,
        };
      } else {
        ctx.body = {
          code: 200,
          success: true,
          message: "绑定成功",
          data: res,
        };
      }
    } catch (error) {
      console.error("bindAccountCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 查找绑定的前台账户信息
  async findBindUsersCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await findBindUsers(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取绑定账号信息成功",
        data: res,
      };
    } catch (error) {
      console.error("findBindUsersCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取博主信息
  async adminFindAuthorInfoCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await findAuthorInfo(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取博主信息成功",
        data: res,
      };
    } catch (error) {
      console.error("adminFindAuthorInfoCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new UserController();
