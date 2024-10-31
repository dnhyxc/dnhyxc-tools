const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  userId: String,
  likeCommentId: String,
});

const Like = mongoose.model("likes", likeSchema);

module.exports =  Like;
