const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  myUserId: String,
  userId: String,
  username: String,
  job: String,
  motto: String,
  headUrl: String,
  introduce: String,
  github: String,
  juejin: String,
  zhihu: String,
  blog: String,
  createTime: Number,
  isFollowed: Boolean,
});

const Follow = mongoose.model("follows", followSchema);

module.exports = Follow;
