const Router = require("koa-router");
const {
  getChatListCtr,
  deleteChatsCtr,
  getCacheChatsCtr,
  mergeChatsCtr,
  getUnReadChatCtr,
  updateNewChatCtr,
  deleteNewChatCtr,
  deleteCatchChatCtr,
  deleteChatMesaageCtr,
} = require("../../controller");

const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

// 获取聊天消息列表
router.post("/getChatList", auth, countApiCalls, getChatListCtr);

// 合并消息
router.post("/mergeChats", auth, countApiCalls, mergeChatsCtr);

// 获取缓存消息
router.post("/getCacheChats", auth, countApiCalls, getCacheChatsCtr);

// 删除聊天消息
router.post("/deleteChats", auth, countApiCalls, deleteChatsCtr);

// 删除联系人时，清空聊天消息
router.post("/deleteChatMesaage", auth, countApiCalls, deleteChatMesaageCtr);

// 获取未读聊天消息数量
router.post("/getUnReadChat", auth, countApiCalls, getUnReadChatCtr);

// 更新最新消息
router.post("/updateNewChat", auth, countApiCalls, updateNewChatCtr);

// 删除最新消息
router.post("/deleteNewChat", auth, countApiCalls, deleteNewChatCtr);

// 删除缓存消息
router.post("/deleteCatchChat", auth, countApiCalls, deleteCatchChatCtr);

module.exports = router;
