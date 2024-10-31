const mongoose = require("mongoose");

const pageConfigSchema = new mongoose.Schema({
  adminUserId: String,
  bindUserId: String,
  usernames: String,
  layout: Number,
  layoutSet: Number,
  cardLayout: Number,
  coverImgs: [String],
  createTime: Number,
});

const PageConfig = mongoose.model("pageConfig", pageConfigSchema);

module.exports = PageConfig;
