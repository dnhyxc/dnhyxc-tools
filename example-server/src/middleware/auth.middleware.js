const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { findUserById, adminFindUserById } = require("../service");
const {
  TokenExpiredError,
  JsonWebTokenError,
  DetailTokenExpiredError,
  databaseError,
  userNotFind,
  userIsDelete,
} = require("../constant");

const auth = async (ctx, next) => {
  const { fromDetail } = ctx.request.body;

  try {
    const { authorization } = ctx.request.header;
    const token = authorization.replace("Bearer ", "");
    const userInfo = jwt.verify(token, JWT_SECRET);
    const { userId, username, password } = userInfo._doc;
    const res = await findUserById(userId);
    if (!res) {
      return ctx.app.emit("error", userNotFind, ctx);
    }
    if (res?.isDelete) {
      return ctx.app.emit("error", userIsDelete, ctx);
    }
    const user = {
      id: userId,
      username,
      password,
    };
    ctx.state.user = user;
  } catch (error) {
    switch (error.name) {
      case "TokenExpiredError":
        // console.error("token已过期", error);
        return ctx.app.emit(
          "error",
          !fromDetail ? JsonWebTokenError : DetailTokenExpiredError,
          ctx
        );
      case "JsonWebTokenError":
        // console.error("无效的token", error);
        return ctx.app.emit(
          "error",
          !fromDetail ? JsonWebTokenError : DetailTokenExpiredError,
          ctx
        );
      default:
        return ctx.app.emit("error", databaseError, ctx);
    }
  }

  await next();
};

const adminAuth = async (ctx, next) => {
  try {
    const { authorization } = ctx.request.header;
    const token = authorization.replace("Bearer ", "");
    const userInfo = jwt.verify(token, JWT_SECRET);
    const { userId, username, password } = userInfo._doc;
    const res = await adminFindUserById(userId);
    if (!res) {
      return ctx.app.emit("error", userNotFind, ctx);
    }
    const user = {
      id: userId,
      username,
      password,
    };
    ctx.state.user = user;
  } catch (error) {
    switch (error.name) {
      case "TokenExpiredError":
        // console.error("token已过期", error);
        return ctx.app.emit("error", TokenExpiredError, ctx);
      case "JsonWebTokenError":
        // console.error("无效的token", error);
        return ctx.app.emit("error", JsonWebTokenError, ctx);
      default:
        return ctx.app.emit("error", databaseError, ctx);
    }
  }

  await next();
};

module.exports = { auth, adminAuth };
