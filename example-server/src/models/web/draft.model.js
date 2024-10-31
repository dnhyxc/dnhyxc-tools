const mongoose = require("mongoose");

const DraftSchema = new mongoose.Schema({
  title: String,
  content: {
    required: true,
    type: String,
  },
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
  originalArticleId: String | Number,
});

const Draft = mongoose.model("drafts", DraftSchema);

module.exports = Draft;
