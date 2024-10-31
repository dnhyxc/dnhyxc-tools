const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
  articleId: String,
  userId: String,
  username: String,
  job: String,
  avatarUrl: String,
  date: Number,
  content: String,
  fromUserId: String,
  likeCount: Number,
  isLike: Boolean,
  isDelete: Boolean,
  headUrl: String,
  replyList: [
    {
      userId: String,
      username: String,
      job: String,
      avatarUrl: String,
      date: Number,
      fromUserId: String,
      fromUsername: String,
      formContent: String,
      content: String,
      likeCount: Number,
      isLike: Boolean,
      fromCommentId: String,
      isDelete: Boolean,
      headUrl: String,
    },
  ],
});

const Comments = mongoose.model("comments", CommentsSchema);

module.exports = Comments;
