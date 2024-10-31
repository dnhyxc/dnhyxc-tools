const Router = require("koa-router");
const {
  createProjectCtr,
  getProjectListCtr,
  updateProjectCtr,
  deleteProjectCtr,
  pullNginxConfigCtr,
  pushNginxConfigCtr,
  restartNginxServiceCtr,
  restartServerCtr,
  getServerLogCtr,
  clearServerLogCtr,
  getNodeServerInfoCtr,
  publishProjectCtr,
  createDeployServerCtr,
  getDeployServerInfoCtr,
} = require("../../controller");

const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

// 创建部署服务器设置
router.post("/createDeployServer", auth, countApiCalls, createDeployServerCtr);

// 获取部署服务器设置
router.post("/getDeployServerInfo", auth, countApiCalls, getDeployServerInfoCtr);

// 创建项目设置
router.post("/createProject", auth, countApiCalls, createProjectCtr);

// 更新项目设置
router.post("/updateProject", auth, countApiCalls, updateProjectCtr);

// 删除项目设置
router.post("/deleteProject", auth, countApiCalls, deleteProjectCtr);

// 获取项目列表
router.post("/getProjectList", auth, countApiCalls, getProjectListCtr);

// 获取nginx配置
router.post("/pullNginxConfig", auth, countApiCalls, pullNginxConfigCtr);

// 部署nginx配置
router.post("/pushNginxConfig", auth, countApiCalls, pushNginxConfigCtr);

// 重启nginx服务
router.post("/restartNginxService", auth, countApiCalls, restartNginxServiceCtr);

// 重启node服务
router.post("/restartServer", auth, countApiCalls, restartServerCtr);

// 获取node服务日志
router.post("/getServerLog", auth, countApiCalls, getServerLogCtr);

// 清除node服务日志
router.post("/clearServerLog", auth, countApiCalls, clearServerLogCtr);

// 获取node服务信息
router.post("/getNodeServerInfo", auth, countApiCalls, getNodeServerInfoCtr);

// 发布项目
router.post("/publishProject", auth, countApiCalls, publishProjectCtr);

module.exports = router;
