const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  userId: String,
  createTime: Number
});

const WebUser = mongoose.model('webuser', userSchema);

module.exports = WebUser;
