const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  userId: String,
  menus: [String]
});

const Menus = mongoose.model("menus", menuSchema);

module.exports = Menus;
