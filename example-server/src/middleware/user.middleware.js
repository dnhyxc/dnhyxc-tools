const bcrypt = require("bcryptjs");
const {
  findOneUser,
  findUserById,
  adminFindOneUser,
  adminFindUserById,
} = require("../service");
const {
  databaseError,
  userFormateError,
  userAlreadyExited,
  userNotFind,
  userPwdError,
  userPhoneError,
  pwdNotChange,
  fieldFormateError,
  userNotExist,
  verifyUserError,
} = require("../constant");

// 校验用户名或密码是否为空
const userValidator = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  if (!username || !password) {
    return ctx.app.emit("error", userFormateError, ctx);
  }
  await next();
};

// 校验用户名是否存在
const verifyUser = async (ctx, next) => {
  const { username } = ctx.request.body;

  if (!username) {
    ctx.app.emit("error", fieldFormateError, ctx);
    return;
  }

  if (username) {
    try {
      const filter = { username };
      if (await findOneUser(filter)) {
        return ctx.app.emit("error", userAlreadyExited, ctx);
      }
      await next();
    } catch (error) {
      ctx.app.emit("error", verifyUserError, ctx);
    }
  }
};

// 校验用户名是否存在
const verifyAdminUser = async (ctx, next) => {
  const { username } = ctx.request.body;

  if (!username) {
    ctx.app.emit("error", fieldFormateError, ctx);
    return;
  }

  if (username) {
    try {
      const filter = { username };
      if (await adminFindOneUser(filter)) {
        return ctx.app.emit("error", userAlreadyExited, ctx);
      }
      await next();
    } catch (error) {
      ctx.app.emit("error", verifyUserError, ctx);
    }
  }
};

// 校验用户是否存在
const verifyUserExists = async (ctx, next) => {
  const { userId } = ctx.request.body;

  if (!userId) {
    ctx.app.emit("error", fieldFormateError, ctx);
    return;
  }

  try {
    const user = await findUserById(userId);
    if (!user) {
      return ctx.app.emit("error", userNotExist, ctx);
    }
    await next();
  } catch (error) {
    ctx.app.emit("error", verifyUserError, ctx);
  }
};

// 校验后台用户是否存在
const verifyAdminUserExists = async (ctx, next) => {
  const { userId } = ctx.request.body;

  if (!userId) {
    ctx.app.emit("error", fieldFormateError, ctx);
    return;
  }

  try {
    const user = await adminFindUserById(userId);
    if (!user) {
      return ctx.app.emit("error", userNotExist, ctx);
    }
    await next();
  } catch (error) {
    ctx.app.emit("error", verifyUserError, ctx);
  }
};

// 根据用户名检验用户是否存在
const verifyUserExistsByUsername = async (ctx, next) => {
  const { username } = ctx.request.body;

  if (!username) {
    ctx.app.emit("error", fieldFormateError, ctx);
    return;
  }

  try {
    const user = await findOneUser({ username });
    if (!user) {
      return ctx.app.emit("error", userNotExist, ctx);
    }
    await next();
  } catch (error) {
    ctx.app.emit("error", verifyUserError, ctx);
  }
};

// 根据用户名检验后台用户是否存在
const verifyAdminUserExistsByUsername = async (ctx, next) => {
  const { username } = ctx.request.body;
  if (!username) {
    ctx.app.emit("error", fieldFormateError, ctx);
    return;
  }

  try {
    const user = await adminFindOneUser({ username });
    if (!user) {
      return ctx.app.emit("error", userNotExist, ctx);
    }
    await next();
  } catch (error) {
    ctx.app.emit("error", verifyUserError, ctx);
  }
};

// 密码加密
const bcryptPassword = async (ctx, next) => {
  const { password } = ctx.request.body;
  if (!password) {
    ctx.app.emit("error", fieldFormateError, ctx);
    return;
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  ctx.request.body.password = hash;

  await next();
};

// 电话号码加密
const bcryptPhone = async (ctx, next) => {
  const { phone } = ctx.request.body;
  if (!phone) {
    ctx.app.emit("error", fieldFormateError, ctx);
    return;
  }
  const salt = bcrypt.genSaltSync(10);
  const phoneHash = bcrypt.hashSync(phone, salt);
  ctx.request.body.phone = phoneHash;
  ctx.request.body.hash = phone;

  await next();
};

// 校验用户手机号是否正确
const verifyPhone = async (ctx, next) => {
  try {
    const { phone, username } = ctx.request.body;
    const filter = { username };
    const user = await findOneUser(filter);
    if (!user) {
      return ctx.app.emit("error", userNotFind, ctx);
    }
    const checkPhone = bcrypt.compareSync(phone, user.phone);
    if (!checkPhone) {
      return ctx.app.emit("error", userPhoneError, ctx);
    }
    await next();
  } catch (error) {
    ctx.app.emit("error", verifyUserError, ctx);
  }
};

// 校验用户用户名或者密码是否正确
const verifyLogin = async (ctx, next) => {
  try {
    const { username, password } = ctx.request.body;
    const filter = { username };
    const user = await findOneUser(filter);
    if (!user) {
      return ctx.app.emit("error", userNotFind, ctx);
    }
    const checkPwd = bcrypt.compareSync(password, user.password);
    if (!checkPwd) {
      return ctx.app.emit("error", userPwdError, ctx);
    }
    await next();
  } catch (error) {
    ctx.app.emit("error", verifyUserError, ctx);
  }
};

// 校验用户用户名或者密码是否正确
const verifyAdminLogin = async (ctx, next) => {
  try {
    const { username, password } = ctx.request.body;
    const filter = { username };
    const user = await adminFindOneUser(filter);
    if (!user) {
      return ctx.app.emit("error", userNotFind, ctx);
    }
    const checkPwd = bcrypt.compareSync(password, user.password);
    if (!checkPwd) {
      return ctx.app.emit("error", userPwdError, ctx);
    }
    await next();
  } catch (error) {
    ctx.app.emit("error", verifyUserError, ctx);
  }
};

const verifyUpdateInfo = async (ctx, next) => {
  const { password } = ctx.request.body;
  const { id } = ctx.state.user;
  try {
    const user = await findUserById(id);
    // 校验密码是否一致
    const checkPwd = bcrypt.compareSync(password, user.password);
    if (checkPwd) {
      return ctx.app.emit("error", pwdNotChange, ctx);
    }
    await next();
  } catch (error) {
    ctx.app.emit("error", verifyUserError, ctx);
  }
};

const verifyAdminUpdateInfo = async (ctx, next) => {
  const { password } = ctx.request.body;
  const { id } = ctx.state.user;
  try {
    const user = await adminFindUserById(id);
    // 校验密码是否一致
    const checkPwd = bcrypt.compareSync(password, user.password);
    if (checkPwd) {
      return ctx.app.emit("error", pwdNotChange, ctx);
    }
    await next();
  } catch (error) {
    ctx.app.emit("error", verifyUserError, ctx);
  }
};

module.exports = {
  userValidator,
  verifyUser,
  bcryptPassword,
  bcryptPhone,
  verifyPhone,
  verifyLogin,
  verifyUpdateInfo,
  verifyUserExists,
  verifyUserExistsByUsername,

  // 后台中间件
  verifyAdminLogin,
  verifyAdminUpdateInfo,
  verifyAdminUser,
  verifyAdminUserExistsByUsername,
  verifyAdminUserExists,
};
