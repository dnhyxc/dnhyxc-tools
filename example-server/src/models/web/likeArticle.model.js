const mongoose = require("mongoose");

const likeArticleSchema = new mongoose.Schema({
  userId: String,
  articleId: String,
});

const LikeArticle = mongoose.model("likeArticles", likeArticleSchema);

module.exports =  LikeArticle;
