const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  userId: String,
  url: String,
  createTime: Number,
  isDelete: Boolean,
  fileName: String,
  coverImg: String,
  size: Number,
  type: String,
  category: String,
  author: String,
  translator: String,
  language: String,
});

const Books = mongoose.model("books", bookSchema);

module.exports = Books;
