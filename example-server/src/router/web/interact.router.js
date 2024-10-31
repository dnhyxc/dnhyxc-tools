const Router = require("koa-router");
const {
  createInteractCtr,
  getInteractsCtr,
  getInteractListCtr,
  removeInteractsCtr,
  delInteractsCtr,
} = require("../../controller");

const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

// 创建留言
router.post("/createInteract", auth, countApiCalls, createInteractCtr);

// 获取留言列表
router.post("/getInteracts", auth, countApiCalls, getInteractsCtr);

// 分页获取留言列表
router.post("/getInteractList", auth, countApiCalls, getInteractListCtr);

// 移除留言列表
router.post("/removeInteracts", auth, countApiCalls, removeInteractsCtr);

// 彻底删除留言列表
router.post("/delInteracts", auth, countApiCalls, delInteractsCtr);

module.exports = router;
