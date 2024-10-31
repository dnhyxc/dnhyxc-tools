const Router = require("koa-router");
const {
  manageFollowCtr,
  getFollowListCtr,
  getFollowMeListCtr,
  findFollowedCtr,
} = require("../../controller");

const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

// 关注/取消关注
router.post("/manageFollow", auth, countApiCalls, manageFollowCtr);

// 获取关注用户列表
router.post("/getFollowList", auth, countApiCalls, getFollowListCtr);

// 获取关注我的用户列表
router.post("/getFollowMeList", auth, countApiCalls, getFollowMeListCtr);

// 查询是否关注
router.post("/findFollowed", auth, countApiCalls, findFollowedCtr);

module.exports = router;
