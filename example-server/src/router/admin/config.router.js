const Router = require("koa-router");
const {
  adminCreateConfigCtr,
  adminCreateThemesCtr,
  adminGetThemesCtr,
} = require("../../controller");

const { adminAuth } = require("../../middleware");

const router = new Router({ prefix: "/admin" });

// 创建页面配置
router.post("/pageConfig", adminAuth, adminCreateConfigCtr);

// 添加主题
router.post("/themes", adminAuth, adminCreateThemesCtr);

// 获取主题
router.post("/getThemes", adminAuth, adminGetThemesCtr);

module.exports = router;
