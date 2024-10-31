const Router = require("koa-router");
const {
  createDraftCtr,
  updateDraftCtr,
  deleteDraftCtr,
  getDraftListCtr,
  getDraftByIdCtr,
} = require("../../controller");

const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

// 创建文章
router.post("/createDraft", auth, countApiCalls, createDraftCtr);

// 更新文章
router.post("/updateDraft", auth, countApiCalls, updateDraftCtr);

// 删除文章
router.post("/deleteDraft", auth, countApiCalls, deleteDraftCtr);

// 获取草稿列表
router.post("/getDraftList", countApiCalls, getDraftListCtr);

// 获取草稿详情
router.post("/getDraftById", countApiCalls, getDraftByIdCtr);

module.exports = router;
