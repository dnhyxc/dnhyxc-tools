const mongoose = require("mongoose");

const bookRecordsSchema = new mongoose.Schema({
  userId: String,
  bookId: String,
  createTime: Number,
  position: Number,
  tocName: String,
  tocHref: String,
  tocId: String,
});

const BookRecords = mongoose.model("bookRecords", bookRecordsSchema);

module.exports = BookRecords;
