const mongoose = require("mongoose");

const verifyCodeSchema = new mongoose.Schema({
  createTime: Number,
  code: String,
});

const VerifyCodes = mongoose.model("verifyCodes", verifyCodeSchema);

module.exports = VerifyCodes;
