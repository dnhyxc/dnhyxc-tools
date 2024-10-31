const mongoose = require("mongoose");

const apiCalledCountsSchema = new mongoose.Schema({
  total: Number,
  createTime: Number,
});

const apiCalledDailyCountsSchema = new mongoose.Schema({
  date: Number,
  total: Number
});

const apiCallsSchema = new mongoose.Schema({
  userId: String,
  apis: [{
    api: String,
    count: Number,
    createTime: Number,
    updateTime: Number
  }]
});

const apiCalledSchema = new mongoose.Schema({
  api: String,
  count: Number,
  createTime: Number,
  updateTime: Number,
  userIds: [String]
});

const ApiCalledCounts = mongoose.model("apiCalledCounts", apiCalledCountsSchema);
const ApiCalls = mongoose.model("apiCalls", apiCallsSchema);
const ApiCalled = mongoose.model("apiCalled", apiCalledSchema);
const ApiCalledDaily = mongoose.model("apiCalledDaily", apiCalledDailyCountsSchema);

module.exports = {
  ApiCalledCounts,
  ApiCalls,
  ApiCalled,
  ApiCalledDaily,
};
