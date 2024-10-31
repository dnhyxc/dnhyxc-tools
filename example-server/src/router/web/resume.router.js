const Router = require("koa-router");
const { saveResumeInfoCtr, updateResumeInfoCtr, deleteResumeInfoCtr, getResumeInfoCtr, getResumeInfoListCtr } = require("../../controller");

const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

router.post("/saveResumeInfo", auth, countApiCalls, saveResumeInfoCtr);

router.post("/updateResumeInfo", auth, countApiCalls, updateResumeInfoCtr);

router.post("/deleteResumeInfo", auth, countApiCalls, deleteResumeInfoCtr);

router.post("/getResumeInfo", auth, countApiCalls, getResumeInfoCtr);

router.post("/getResumeInfoList", auth, countApiCalls, getResumeInfoListCtr);

module.exports = router;
