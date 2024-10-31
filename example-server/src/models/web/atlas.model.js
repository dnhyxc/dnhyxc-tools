const mongoose = require("mongoose");

const atlasSchema = new mongoose.Schema({
  userId: String,
  url: String,
  createTime: Number,
  isDelete: Boolean,
  fileName: String,
  size: Number,
  type: String,
});

const Atlas = mongoose.model("atlas", atlasSchema);

module.exports = Atlas;
