const Router = require("koa-router");
const {
  addCodeCtr,
  updateCodeCtr,
  deleteCodeCtr,
  getCodeListCtr,
  getCodeByIdCtr,
  compileCCodeCtr,
  compileJSCodeCtr,
  addCodeFoldersCtr,
  updateCodeFoldersCtr,
  getCodeFoldersByIdCtr,
  deleteCodeFoldersCtr,
  getCodeFoldersWithTotalCtr,
} = require("../../controller");

const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

// 添加代码示例
router.post("/addCode", auth, countApiCalls, addCodeCtr);

// 获取代码示例列表
router.post("/getCodeList", auth, countApiCalls, getCodeListCtr);

// 删除代码示例
router.post("/deleteCode", auth, countApiCalls, deleteCodeCtr);

// 更新代码示例
router.post("/updateCode", auth, countApiCalls, updateCodeCtr);

// 获取代码示例
router.post("/getCodeById", auth, countApiCalls, getCodeByIdCtr);

// 编译C语言
router.post("/compileCCode", auth, countApiCalls, compileCCodeCtr);

// 编译JS
router.post("/compileJSCode", auth, countApiCalls, compileJSCodeCtr);

// 添加代码文件夹
router.post("/addCodeFolders", auth, countApiCalls, addCodeFoldersCtr);

// 更新代码文件夹
router.post("/updateCodeFolders", auth, countApiCalls, updateCodeFoldersCtr);

// 获取代码文件夹
router.post("/getCodeFolders", auth, countApiCalls, getCodeFoldersByIdCtr);

// 删除代码文件夹
router.post("/deleteCodeFolders", auth, countApiCalls, deleteCodeFoldersCtr);

// 获取代码文件夹列表
router.post("/getCodeFolderList", auth, countApiCalls, getCodeFoldersWithTotalCtr);

module.exports = router;
