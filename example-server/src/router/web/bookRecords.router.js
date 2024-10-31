const Router = require("koa-router");
const {
  createReadBookRecordsCtr,
  getReadBookRecordsCtr,
  deleteReadBookRecordsCtr,
} = require("../../controller");

const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

// 添加读书记录
router.post("/createReadBookRecords", auth, countApiCalls, createReadBookRecordsCtr);

// 获取读书记录
router.post("/getReadBookRecords", auth, countApiCalls, getReadBookRecordsCtr);

// 删除读书记录
router.post("/deleteReadBookRecords", auth, countApiCalls, deleteReadBookRecordsCtr);

module.exports = router;
