const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
  userId: String,
  createTime: Number,
  title: String,
  content: String,
  abstract: String,
  language: String,
});

const codeFolderSchema = new mongoose.Schema({
  id: String,
  label: String,
  type: String,
  code: String,
  children: [this] // 递归定义
});

const codeFoldersSchema = new mongoose.Schema({
  userId: String,
  createTime: Number,
  title: String,
  codeFolders: [codeFolderSchema],
  abstract: String,
});

const Codes = mongoose.model("code", codeSchema);

const CodeFolders = mongoose.model("codeFolders", codeFoldersSchema);

module.exports = {
  Codes,
  CodeFolders,
};
