const Router = require("koa-router");
const {
  createCollectionCtr,
  getCollectionListCtr,
  collectArticlesCtr,
  checkCollectionStatusCtr,
  cancelCollectedCtr,
  getCollectedTotalCtr,
  delCollectionCtr,
  updateCollectionCtr,
  getCollectInfoCtr,
  getCollectArticlesCtr,
  removeCollectArticleCtr,
  getCollectTotalCtr,
} = require("../../controller");

const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

// 创建收藏集
router.post("/createCollection", auth, countApiCalls, createCollectionCtr);

// 获取收藏集列表
router.post("/getCollectionList", auth, countApiCalls, getCollectionListCtr);

// 收藏文章
router.post("/collectArticles", auth, countApiCalls, collectArticlesCtr);

// 获取文章收藏状态
router.post("/checkCollectionStatus", countApiCalls, checkCollectionStatusCtr);

// 取消收藏
router.post("/cancelCollected", auth, countApiCalls, cancelCollectedCtr);

// 获取收藏集数
router.post("/getCollectedTotal", auth, countApiCalls, getCollectedTotalCtr);

// 删除收藏集
router.post("/delCollection", auth, countApiCalls, delCollectionCtr);

// 更新收藏集
router.post("/updateCollection", auth, countApiCalls, updateCollectionCtr);

// 获取收藏集详情
router.post("/getCollectInfo", auth, countApiCalls, getCollectInfoCtr);

// 获取收藏集详情
router.post("/getCollectArticles", auth, countApiCalls, getCollectArticlesCtr);

// 删除收藏集文章
router.post("/removeCollectArticle", auth, countApiCalls, removeCollectArticleCtr);

// 获取收藏集总数
router.post("/getCollectTotal", auth, countApiCalls, getCollectTotalCtr);

module.exports = router;
