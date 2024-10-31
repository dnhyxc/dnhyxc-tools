const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  classify: {
    type: String,
  },
  tag: {
    type: String,
  },
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
  isTop: Number,
  gradient: [
    [Number, Number, Number],
    [Number, Number, Number],
  ],
});

const Article = mongoose.model("articles", ArticleSchema);

module.exports = Article;
