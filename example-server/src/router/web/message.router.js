const Router = require("koa-router");
const {
  getMessageListCtr,
  setReadStatusCtr,
  getNoReadMsgCountCtr,
  deleteMessageCtr,
  deleteAllMessageCtr,
} = require("../../controller");

const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

// 获取消息列表
router.post("/getMessageList", auth, countApiCalls, getMessageListCtr);

// 更改消息阅读状态
router.post("/setReadStatus", auth, countApiCalls, setReadStatusCtr);

// 获取未读消息数量
router.post("/getNoReadMsgCount", auth, countApiCalls, getNoReadMsgCountCtr);

// 删除消息
router.post("/deleteMessage", auth, countApiCalls, deleteMessageCtr);

// 删除全部消息
router.post("/deleteAllMessage", auth, countApiCalls, deleteAllMessageCtr);

module.exports = router;
