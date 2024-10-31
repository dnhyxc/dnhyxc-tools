const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  createTime: Number,
  userId: String,
  elements: [{
    key: String,
    title: String,
    sort: Number,
  }],
  resumeInfo: Object,
  customStyles: Object,
  customModuleCount: Number,
  baseLayoutType: String,
  baseViewType: String,
  titleStyle: String,
  coverUrl: String,
});

const Resume = mongoose.model("resume", ResumeSchema);

module.exports = Resume;
