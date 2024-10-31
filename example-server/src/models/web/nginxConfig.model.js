const mongoose = require("mongoose");

const NginxConfigSchema = new mongoose.Schema({
  abstract: String,
  config: String,
  createTime: Number,
  userId: String,
});

const NginxConfig = mongoose.model("nginxConfig", NginxConfigSchema);

module.exports = NginxConfig;
