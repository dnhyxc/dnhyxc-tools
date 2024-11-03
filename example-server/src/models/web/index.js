const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
  createDate: Number,
  userId: String
});

const Todo = mongoose.model('todo', todoSchema);

module.exports = Todo;
