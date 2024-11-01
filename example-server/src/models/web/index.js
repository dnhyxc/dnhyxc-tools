const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: String,
  userId: String
});

const Todo = mongoose.model('todo', todoSchema);

module.exports = Todo;
