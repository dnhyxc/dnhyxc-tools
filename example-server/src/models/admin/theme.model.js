const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema({
  uid: String,
  name: String,
  size: Number,
  type: String,
  url: String,
  auth: [
    {
      username: String,
      userId: String,
    },
  ], // 权限
  createTime: Number,
  userId: String,
  bindUserIds: [String], // 绑定的前台用户
});

const Themes = mongoose.model("themes", themeSchema);

module.exports = Themes;
