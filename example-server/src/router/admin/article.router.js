const Router = require("koa-router");
const {
  adminCreateArticleCtr,
  adminUpdateArticleCtr,
  adminDeleteArticleCtr,
  adminGetArticleListCtr,
  adminSearchArticleCtr,
  adminGetArticleByIdCtr,
  adminBatchDeleteArticleCtr,
  adminShelvesArticleCtr,
  adminRemoveArticleCtr,
  adminFindCommentsByIdCtr,
  adminDeleteCommentCtr,
  adminRemoveCommentCtr,
  adminRestoreCommentCtr,
  adminFindArticleByCoverImageCtr,
  adminGetArticlesCommentsCtr,
} = require("../../controller");

const { adminAuth } = require("../../middleware");

const router = new Router({ prefix: "/admin" });

// 创建文章
router.post("/createArticle", adminAuth, adminCreateArticleCtr);

// 更新文章
router.post("/updateArticle", adminAuth, adminUpdateArticleCtr);

// 删除文章
router.post("/deleteArticle", adminAuth, adminDeleteArticleCtr);

// 获取文章
router.post("/articleList", adminAuth, adminGetArticleListCtr);

// 搜索文章
router.post("/searchArticle", adminAuth, adminSearchArticleCtr);

// 获取文章详情
router.post("/articleDetail", adminAuth, adminGetArticleByIdCtr);

// 批量删除文章
router.post("/batchDelArticle", adminAuth, adminBatchDeleteArticleCtr);

// 下架文章
router.post("/removeArticle", adminAuth, adminRemoveArticleCtr);

// 上架文章
router.post("/shelvesArticle", adminAuth, adminShelvesArticleCtr);

// 获取文章评论
router.post("/getCommentList", adminAuth, adminFindCommentsByIdCtr);

// 删除文章评论
router.post("/deleteComment", adminAuth, adminDeleteCommentCtr);

// 作废文章评论
router.post("/removeComment", adminAuth, adminRemoveCommentCtr);

// 恢复前台删除的文章评论
router.post("/restoreComment", adminAuth, adminRestoreCommentCtr);

// 根据封面图获取文章
router.post("/findArticleByCoverImage", adminFindArticleByCoverImageCtr);

// 获取评论列表
router.post("/getArticlesComments", adminAuth, adminGetArticlesCommentsCtr);

module.exports = router;
