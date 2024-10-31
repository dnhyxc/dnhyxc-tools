const Router = require("koa-router");
const {
  createConvertCtr,
  getConvertListCtr,
  deleteConvertCtr,
} = require("../../controller");

const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

// 添加转换列表
router.post("/createConvert", auth, countApiCalls, createConvertCtr);

// 获取转换列表
router.post("/getConvertList", auth, countApiCalls, getConvertListCtr);

// 删除转换列表
router.post("/deleteConvert", auth, countApiCalls, deleteConvertCtr);

module.exports = router;
