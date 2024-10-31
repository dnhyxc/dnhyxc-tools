const { ApiCalled, ApiCalledCounts, ApiCalledDaily } = require("../../models");
const { getTodayDate } = require("../../utils");

class AdminApiCallsServer {
  // 添加api调用次数
  async adminApiCalled(params) {
    const { userId = Date.now(), api } = params;

    await ApiCalled.findOneAndUpdate(
      { api: api.replace(/^\/api\//, '') },
      {
        $inc: { count: 1 },
        $set: { updateTime: Date.now() },
        $addToSet: { userIds: userId }
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
        new: true
      }
    );

    await ApiCalledCounts.findOneAndUpdate(
      {},
      { $inc: { total: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    await ApiCalledDaily.findOneAndUpdate(
      { date: getTodayDate() },
      { $inc: { total: 1, } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
  }

  // 添加api调用次数
  // async adminApiCalls(params) {
  //   const { userId, api } = params;

  //   const findOneApiCalls = await ApiCalls.findOne({ userId });

  //   if (findOneApiCalls) {
  //     const findOneApi = findOneApiCalls.apis.find(item => item.api === api);
  //     if (findOneApi) {
  //       await ApiCalls.updateOne({ userId, 'apis.api': api }, { $inc: { 'apis.$.count': 1 }, $set: { 'apis.$.updateTime': Date.now() } });
  //     } else {
  //       await ApiCalls.updateOne({ userId }, { $push: { apis: { api, count: 1, createTime: Date.now(), updateTime: Date.now() } } });
  //     }
  //   } else {
  //     await ApiCalls.create({ userId, apis: [{ api, count: 1, createTime: Date.now(), updateTime: Date.now() }] });
  //   }

  //   await ApiCalledCounts.findOneAndUpdate(
  //     {},
  //     { $inc: { total: 1 } },
  //     { upsert: true, new: true, setDefaultsOnInsert: true }
  //   )
  // }

  // 获取api调用次数
  async adminGetApiCalledList() {
    const total = await ApiCalled.find({}, {
      id: '$_id',
      _id: 0,
      api: 1,
      count: 1,
      updateTime: 1,
      userIds: 1
    }).sort({ updateTime: -1 });
    return total;
  }

  // 获取api调用次数
  async adminGetApiCallsTotal() {
    const total = await ApiCalledCounts.findOne({}, { id: '$_id', _id: 0, total: 1 });
    return total;
  }

  // 获取api每日调用次数
  async adminGetApiCallsTotalByDay() {
    const total = await ApiCalledDaily.findOne({ date: getTodayDate() }, { id: '$_id', _id: 0, total: 1, date: 1 });
    return total;
  }
}

module.exports = new AdminApiCallsServer();
