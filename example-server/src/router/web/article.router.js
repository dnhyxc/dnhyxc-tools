const Router = require("koa-router");
const {
  getArticleListCtr,
  createArticleCtr,
  getArticleByIdCtr,
  deleteArticleCtr,
  likeArticleCtr,
  updateArticleCtr,
  searchArticleCtr,
  getArticleByRandomCtr,
  delAllArticleCtr,
  getPrevArticleCtr,
  getNextArticleCtr,
  advancedSearchCtr,
  getLikenessArticlesCtr,
  checkArticleLikeStatusCtr,
  findMostLikeAndNewArticlesCtr,
  findArticleByCoverImageCtr,
} = require("../../controller");

const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

// 创建文章
router.post("/createArticle", auth, countApiCalls, createArticleCtr);

// 更新文章
router.post("/updateArticle", auth, countApiCalls, updateArticleCtr);

// 删除文章
router.post("/deleteArticle", auth, countApiCalls, deleteArticleCtr);

// 文章点赞
router.post("/likeArticle", auth, countApiCalls, likeArticleCtr);

// 获取文章
router.post("/articleList", countApiCalls, getArticleListCtr);

// 搜索文章
router.post("/searchArticle", countApiCalls, searchArticleCtr);

// 获取文章详情
router.post("/articleDetail", countApiCalls, getArticleByIdCtr);

// 随机获取文章
router.post("/getArticleByRandom", countApiCalls, getArticleByRandomCtr);

// 获取上一篇文章
router.post("/getPrevArticle", countApiCalls, getPrevArticleCtr);

// 获取下一篇文章
router.post("/getNextArticle", countApiCalls, getNextArticleCtr);

// 高级搜索
router.post("/advancedSearch", countApiCalls, advancedSearchCtr);

// 删除所有文章
// router.del("/delAllArticle", delAllArticleCtr);

// 获取相似的文章
router.post("/getLikenessArticles", countApiCalls, getLikenessArticlesCtr);

// 校验文章点赞状态
router.post("/checkArticleLikeStatus", countApiCalls, checkArticleLikeStatusCtr);

// 获取最新及最多点赞的文章
router.post("/findMostLikeAndNewArticles", countApiCalls, findMostLikeAndNewArticlesCtr);

// 根据封面图获取文章
router.post("/findArticleByCoverImage", countApiCalls, findArticleByCoverImageCtr);

module.exports = router;
