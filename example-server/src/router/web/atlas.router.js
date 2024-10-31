const Router = require("koa-router");
const {
  addAtlasImagesCtr,
  getAtlasListCtr,
  deleteAtlasImagesCtr,
  updateFileInfoCtr,
} = require("../../controller");

const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });


// 添加图片集图片
router.post("/addAtlasImages", auth, countApiCalls, addAtlasImagesCtr);

// 获取图片集图片
router.post("/getAtlasList", auth, countApiCalls, getAtlasListCtr);

// 删除图片集图片
router.post("/deleteAtlasImages", auth, countApiCalls, deleteAtlasImagesCtr);

// 更新图片集图片信息
router.post("/updateFileInfo", auth, countApiCalls, updateFileInfoCtr);

module.exports = router;
