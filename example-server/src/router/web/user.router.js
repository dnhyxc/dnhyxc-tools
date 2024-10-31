const Router = require("koa-router");
const {
  registerCtr,
  loginCtr,
  updateInfoCtr,
  resetPwdCtr,
  logoutCtr,
  getUserInfoCtr,
  verifyTokenCtr,
  getVerifyCodeCtr,
  findMenusCtr,
} = require("../../controller");
const {
  userValidator,
  verifyUser,
  bcryptPassword,
  bcryptPhone,
  verifyPhone,
  verifyLogin,
  auth,
  verifyUpdateInfo,
  verifyUserExistsByUsername,
  verifyUserExists,
  countApiCalls,
} = require("../../middleware");

const router = new Router({ prefix: "/api" });

// 注册接口
router.post(
  "/register",
  userValidator, // 检验用户名或密码是否为空中间件
  verifyUser, // 检验用户名是否存在中间件
  bcryptPassword, // 密码加密中间件
  bcryptPhone, // 密码号码中间件
  registerCtr
);

// 获取验证码
router.post("/verifyCode", countApiCalls, getVerifyCodeCtr);

// 登录接口
router.post("/login", userValidator, verifyLogin, countApiCalls, loginCtr);

// 获取用户信息
router.post("/getUserInfo", countApiCalls, getUserInfoCtr);

// 注销
router.post("/logout", auth, verifyUserExists, countApiCalls, logoutCtr);

// 修改用户信息接口
router.put(
  "/updateInfo",
  auth,
  verifyUserExists,
  // verifyUpdateInfo,
  countApiCalls,
  updateInfoCtr
);

// 重置密码
router.put(
  "/resetPassword",
  // auth,
  verifyUserExistsByUsername,
  // verifyUpdateInfo,
  verifyPhone,
  bcryptPassword,
  countApiCalls,
  resetPwdCtr
);

// 校验token是否过期
router.post("/verify", auth, countApiCalls, verifyTokenCtr);

// 获取菜单权限列表
router.post("/getUserMenuRoles", auth, countApiCalls, findMenusCtr);

module.exports = router;
