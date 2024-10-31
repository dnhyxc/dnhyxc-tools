const Router = require("koa-router");
const {
  addBookCtr,
  updateBookInfoCtr,
  getBookListCtr,
  findBookCtr,
  deleteBookCtr,
} = require("../../controller");

const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

// 添加书籍图片
router.post("/addBook", auth, countApiCalls, addBookCtr);

// 查找书籍信息
router.post("/findBook", auth, countApiCalls, findBookCtr);

// 获取书籍
router.post("/getBookList", auth, countApiCalls, getBookListCtr);

// 删除书籍图片
router.post("/deleteBook", auth, countApiCalls, deleteBookCtr);

// 更新书籍信息
router.post("/updateBookInfo", auth, countApiCalls, updateBookInfoCtr);

module.exports = router;
