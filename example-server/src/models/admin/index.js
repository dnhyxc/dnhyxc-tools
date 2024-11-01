const mongoose = require('mongoose');

const adminDemoSchema = new mongoose.Schema({
  title: String,
  userId: String
});

const AdminDemo = mongoose.model('adminDemo', adminDemoSchema);

module.exports = AdminDemo;
