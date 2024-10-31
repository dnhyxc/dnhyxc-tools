const Router = require("koa-router");
const {
  uploadFileCtr,
  removeFileCtr,
  downLoadFileCtr,
} = require("../../controller");
const { adminAuth } = require("../../middleware");

const router = new Router({ prefix: "/admin" });

// 上传图片
router.post("/upload", adminAuth, uploadFileCtr);

// 删除图片
router.post("/removeFile", adminAuth, removeFileCtr);

// 文件下载
router.post("/downLoadFile", downLoadFileCtr);

module.exports = router;
