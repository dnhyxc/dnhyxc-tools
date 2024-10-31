const { Convert } = require("../../models");

class convertServer {
  // 创建转换列表
  async createConvert({ userId, keyword }) {
    const count = await Convert.find({ userId }).count();
    // 如果转换列表超过5条后，删除最先转换的那条
    if (count > 10) {
      await Convert.findOneAndDelete({ userId }, { sort: { createTime: 1 } });
      const res = await Convert.create({
        userId,
        keyword,
        createTime: new Date().valueOf(),
      });
      return res;
    } else {
      const res = await Convert.create({
        userId,
        keyword,
        createTime: new Date().valueOf(),
      });
      return res;
    }
  }

  // 获取转换列表
  async getConvertList({ userId }) {
    const res = await Convert.find(
      {
        userId,
      },
      { id: "$_id", _id: 0, keyword: 1, userId: 1, createTime: 1 }
    ).sort({ createTime: -1 });
    return res;
  }

  // 删除
  async deleteConvert({ userId, id }) {
    const ids = Array.isArray(id) ? id : [id];
    const res = await Convert.deleteMany({
      userId,
      _id: { $in: ids },
    });
    return res.deletedCount;
  }
}

module.exports = new convertServer();
