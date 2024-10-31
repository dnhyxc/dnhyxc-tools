const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  userId: String,
  chat: {
    from: String, // 发送用户的id
    to: String, // 接收用户的id
    chatId: String, // from和to组成的字符串
    content: String, // 内容
    read: Boolean, // 标识是否已读
    createTime: Number, // 创建时间
    replyInfo: {
      username: String, // 被回复人名称
      content: String, // 内容
      createTime: Number, // 创建时间
    },
  },
});

const Chat = mongoose.model("chats", chatSchema);
const CacheChats = mongoose.model("cacheChats", chatSchema);
const NewChats = mongoose.model("newChats", chatSchema);

module.exports = {
  Chat,
  CacheChats,
  NewChats,
};
