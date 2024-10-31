const Router = require("koa-router");
const {
  createCommentsCtr,
  findCommentsByIdCtr,
  giveLikeCtr,
  deleteCommentCtr,
} = require("../../controller");
const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

// 创建评论
router.post("/comments", auth, countApiCalls, createCommentsCtr);
// 获取评论
router.post("/getCommentList", countApiCalls, findCommentsByIdCtr);
// 点赞
router.post("/giveLike", auth, countApiCalls, giveLikeCtr);
// 删除评论
router.post("/deleteComment", auth, countApiCalls, deleteCommentCtr);

module.exports = router;
