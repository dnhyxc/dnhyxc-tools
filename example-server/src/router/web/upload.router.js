const Router = require("koa-router");
const {
  uploadFileCtr,
  removeFileCtr,
  downLoadFileCtr,
} = require("../../controller");
const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

// 上传图片
router.post("/upload", auth, countApiCalls, uploadFileCtr);

// 删除图片
router.post("/removeFile", auth, countApiCalls, removeFileCtr);

// 文件下载
router.post("/downLoadFile", countApiCalls, downLoadFileCtr);

module.exports = router;
