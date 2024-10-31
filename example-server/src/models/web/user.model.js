const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  phone: String,
  hash: String,
  is_admin: Boolean,
  job: String,
  motto: String,
  headUrl: String,
  introduce: String,
  github: String,
  juejin: String,
  zhihu: String,
  blog: String,
  mainCover: String,
  auth: Number,
  logout: String,
  registerTime: Number,
  updateTime: Number,
  isDelete: Boolean,
  bindUserId: String,
  menus: [String],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
