const Router = require("koa-router");
const {
  adminRegisterCtr,
  adminLoginCtr,
  adminGetUserInfoCtr,
  adminUpdateInfoCtr,
  adminVerifyTokenCtr,
  adminGetUserListCtr,
  adminGetAdminUserListCtr,
  adminBatchDeleteUserCtr,
  adminUpdateAdminUsersCtr,
  adminDeleteAdminUsersCtr,
  adminSetAuthCtr,
  adminSetAdminUserAuthCtr,
  adminUpdateUsersCtr,
  bindAccountCtr,
  findBindUsersCtr,
  adminFindAuthorInfoCtr,
  adminResetPwdCtr,
  adminFindMenusCtr,
  adminGetVerifyCodeCtr,
} = require("../../controller");
const {
  userValidator,
  verifyUser,
  bcryptPassword,
  verifyUserExists,
  verifyAdminLogin,
  verifyAdminUser,
  auth,
  adminAuth,
  verifyAdminUserExistsByUsername,
  verifyAdminUserExists,
} = require("../../middleware");

const router = new Router({ prefix: "/admin" });

// 注册接口
router.post(
  "/register",
  userValidator, // 检验用户名或密码是否为空中间件
  verifyAdminUser, // 检验用户名是否存在中间件
  bcryptPassword, // 密码加密中间件
  adminRegisterCtr
);

// 获取验证码
router.post("/verifyCode", adminGetVerifyCodeCtr);

// 登录接口
router.post("/login", userValidator, verifyAdminLogin, adminLoginCtr);

// 重置密码
router.put(
  "/resetPassword",
  verifyAdminUserExistsByUsername,
  bcryptPassword,
  adminResetPwdCtr
);

// 获取用户信息
router.post("/getUserInfo", adminGetUserInfoCtr);

// 修改用户信息接口
router.post(
  "/updateUserInfo",
  adminAuth,
  verifyAdminUserExists,
  adminUpdateInfoCtr
);

// 修改用户信息接口
router.put(
  "/updatePassword",
  adminAuth,
  verifyAdminUserExists,
  // verifyUpdateInfo,
  bcryptPassword,
  adminUpdateInfoCtr
);

// 校验token是否过期
router.post("/verify", adminAuth, adminVerifyTokenCtr);

// 获取前台用户列表
router.post("/getUserList", adminAuth, adminGetUserListCtr);

// 获取后台用户列表
router.post("/getAdminUserList", adminAuth, adminGetAdminUserListCtr);

// 批量删除用户
router.post("/batchDeleteUser", adminAuth, adminBatchDeleteUserCtr);

// 批量为用户增加删除标识
router.post("/updateUsers", adminAuth, adminUpdateUsersCtr);

// 批量删除后台用户
router.post("/deleteAdminUsers", adminAuth, adminDeleteAdminUsersCtr);

// 批量为后台用户增加删除标识
router.post("/manageAdminUsers", adminAuth, adminUpdateAdminUsersCtr);

// 设置用户权限
router.post("/setAuth", adminAuth, adminSetAuthCtr);

// 设置权限
router.post("/setAdminUserAuth", adminAuth, adminSetAdminUserAuthCtr);

// 绑定账户
router.post("/bindAccount", adminAuth, bindAccountCtr);

// 获取绑定账户信息
router.post("/findBindUsers", adminAuth, findBindUsersCtr);

// 获取博主信息
router.post("/getAuthorInfo", adminAuth, adminFindAuthorInfoCtr);

// 获取用户菜单权限
router.post("/getUserMenuRoles", adminAuth, adminFindMenusCtr);

module.exports = router;
