const Router = require("koa-router");
const {
  adminCreateClassifyCtr,
  adminUpdateClassifyCtr,
  adminDelClassifysCtr,
  adminGetClassifyListCtr,
  adminAddClassifyCtr,
  getTagListCtr,
} = require("../../controller");

const { adminAuth } = require("../../middleware");

const router = new Router({ prefix: "/admin" });

// 创建分类
router.post("/createClassify", adminAuth, adminCreateClassifyCtr);

// 更新分类
router.post("/updateClassify", adminAuth, adminUpdateClassifyCtr);

// 删除分类
router.post("/deleteClassifys", adminAuth, adminDelClassifysCtr);

// 添加分类
router.post("/addClassify", adminAuth, adminAddClassifyCtr);

// 获取分类
router.post("/getClassifyList", adminAuth, adminGetClassifyListCtr);

// 获取分类统计
router.post("/getTagList", adminAuth, getTagListCtr);

module.exports = router;
