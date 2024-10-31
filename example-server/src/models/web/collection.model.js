const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema({
  name: String,
  count: Number,
  desc: String,
  status: Number, // 1: 公开，2：私有
  createTime: Number,
  articleIds: [String],
  userId: String,
});

const Collection = mongoose.model("collections", CollectionSchema);

module.exports = Collection;
