const Router = require("koa-router");
const {
  adminGetInteractListCtr,
  adminRemoveInteractsCtr,
  adminRestoreInteractsCtr,
  adminDelInteractsCtr,
} = require("../../controller");

const { adminAuth } = require("../../middleware");

const router = new Router({ prefix: "/admin" });

// 分页获取留言列表
router.post("/getInteractList", adminAuth, adminGetInteractListCtr);

// 移除留言
router.post("/removeInteracts", adminAuth, adminRemoveInteractsCtr);

// 恢复留言
router.post("/restoreInteracts", adminAuth, adminRestoreInteractsCtr);

// 彻底删除留言列表
router.post("/delInteracts", adminAuth, adminDelInteractsCtr);

module.exports = router;
