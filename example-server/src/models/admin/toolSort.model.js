const mongoose = require("mongoose");

const toolSortSchema = new mongoose.Schema({
  userId: String,
  sortInfo: [{
    id: String,
    sort: Number,
  }],
  createTime: Number
});

const ToolSort = mongoose.model("toolSorts", toolSortSchema);

module.exports = ToolSort;
