const Router = require("koa-router");
const {
  adminGetArticlesStatisticsCtr,
  adminGetRegisterStatisticsCtr,
  adminGetAuhthorListCtr,
  adminGetPopularArticlesCtr,
} = require("../../controller");

const { adminAuth } = require("../../middleware");

const router = new Router({ prefix: "/admin" });

// 获取文章统计
router.post("/getArticlesStatistics", adminAuth, adminGetArticlesStatisticsCtr);

// 获取当前年用户注册情况统计
router.post("/getRegisterStatistics", adminAuth, adminGetRegisterStatisticsCtr);

// 获取作者人数
router.post("/getAuhthorList", adminAuth, adminGetAuhthorListCtr);

// 获取最受欢迎的文章
router.post("/getPopularArticles", adminAuth, adminGetPopularArticlesCtr);

module.exports = router;
