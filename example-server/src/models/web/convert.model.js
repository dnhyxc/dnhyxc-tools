const mongoose = require("mongoose");

const convertSchema = new mongoose.Schema({
  userId: String,
  keyword: String,
  createTime: Number,
});

const Convert = mongoose.model("convert", convertSchema);

module.exports = Convert;
