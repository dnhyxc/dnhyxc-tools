const mongoose = require("mongoose");

const interactSchema = new mongoose.Schema({
  avatar: String,
  userId: String,
  username: String,
  comment: String,
  createTime: Number,
  isDelete: Boolean,
});

const Interact = mongoose.model("interacts", interactSchema);

module.exports = Interact;
