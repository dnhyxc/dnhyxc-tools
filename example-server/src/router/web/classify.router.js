const Router = require("koa-router");
const {
  getClassifyListCtr,
  getTagListCtr,
  getTimelineListCtr,
  getAddedClassifysCtr,
} = require("../../controller");

const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

// 获取分类列表
router.post("/getClassifyList", countApiCalls, getClassifyListCtr);

// 获取标签列表
router.post("/getTagList", countApiCalls, getTagListCtr);

// 获取时间轴列表
router.post("/getTimelineList", auth, countApiCalls, getTimelineListCtr);

// 获取后台添加的文章列表
router.post("/getAddedClassifys", auth, countApiCalls, getAddedClassifysCtr);

module.exports = router;
