const Router = require("koa-router");
const { adminGetApiCallsTotalCtr, adminGetApiCallsTotalByDayCtr, adminGetApiCalledListCtr } = require("../../controller");

const { adminAuth } = require("../../middleware");

const router = new Router({ prefix: "/admin" });

router.post("/getApiCallsTotal", adminAuth, adminGetApiCallsTotalCtr);

router.post("/getApiCallsTotalByDay", adminAuth, adminGetApiCallsTotalByDayCtr);

router.post("/getApiCalledList", adminAuth, adminGetApiCalledListCtr);

module.exports = router;
