const mongoose = require("mongoose");

const verifyCodeSchema = new mongoose.Schema({
  createTime: Number,
  code: String,
});

const AdminVerifyCodes = mongoose.model("adminVerifyCodes", verifyCodeSchema);

module.exports = AdminVerifyCodes;
