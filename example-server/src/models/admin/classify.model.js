const mongoose = require("mongoose");

const classifySchema = new mongoose.Schema({
  icon: String,
  addUserIds: [String],
  userIds: [String],
  classifyName: String,
  articleIds: [String],
  createTime: Number,
});

const Classify = mongoose.model("classify", classifySchema);

module.exports = Classify;
