const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  action: String,
  toUserId: String,
  fromUsername: String,
  fromUserId: String,
  title: String,
  content: String,
  classify: String,
  tag: String,
  coverImage: String,
  abstract: String,
  createTime: Number,
  authorId: String,
  authorName: String,
  isDelete: Boolean,
  isLike: Boolean,
  likeCount: Number,
  readCount: Number,
  collectCount: Number,
  pushDate: Number,
  isReaded: Boolean,
  isRemove: Boolean,
  articleId: String,
  // 私信
  from: String,
  to: String,
  content: String,
  chatId: String,
});

const Message = mongoose.model("messages", messageSchema);

module.exports = Message;
