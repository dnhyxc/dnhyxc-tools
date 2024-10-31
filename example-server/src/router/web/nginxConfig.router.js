const Router = require("koa-router");
const { saveNginxConfigCtr, updateNginxConfigCtr, deleteNginxConfigCtr, getNginxConfigListCtr } = require("../../controller");

const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

router.post("/saveNginxConfig", auth, countApiCalls, saveNginxConfigCtr);

router.post("/updateNginxConfig", auth, countApiCalls, updateNginxConfigCtr);

router.post("/deleteNginxConfig", auth, countApiCalls, deleteNginxConfigCtr);

router.post("/getNginxConfigList", auth, countApiCalls, getNginxConfigListCtr);

module.exports = router;
