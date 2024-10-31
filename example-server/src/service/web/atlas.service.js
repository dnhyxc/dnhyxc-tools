const { Atlas } = require("../../models");

class AtlasServer {
  // 添加图片
  async addAtlasImages({ userId, url, fileName, size, type }) {
    const res = await Atlas.create({
      userId,
      url,
      createTime: new Date().valueOf(),
      fileName,
      size,
      type,
    });

    return {
      userId: res.userId,
      createTime: res.createTime,
      url: res.url,
      id: res._id,
      fileName: res.fileName,
      size: res.size,
      type: res.type,
    };
  }

  async findAtlasImage({ url, userId }) {
    const res = await Atlas.findOne(
      {
        url,
        userId
      },
      {
        id: "$_id",
        _id: 0,
        createTime: 1,
        url: 1,
        userId: 1,
        type: 1,
        fileName: 1,
        size: 1,
      }
    );

    return res;
  }

  // 更新图片信息
  async updateFileInfo({ id, fileName }) {
    const res = await Atlas.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          fileName,
        },
      }
    );
    return res.modifiedCount;
  }

  // 获取图片集列表
  async getAtlasWithTotal({ pageNo, pageSize, userId }) {
    const list = await Atlas.aggregate([
      { $match: { userId } },
      {
        $facet: {
          total: [{ $count: "count" }],
          data: [
            {
              $project: {
                id: "$_id",
                _id: 0,
                userId: 1,
                url: 1,
                createTime: 1,
                isDelete: 1,
                fileName: 1,
                size: 1,
                type: 1,
              },
            },
            {
              $sort: { createTime: -1 },
            },
            { $skip: (pageNo - 1) * pageSize },
            { $limit: pageSize },
          ],
        },
      },
    ]);

    if (list?.length) {
      const { total, data } = list[0];
      return {
        total: total[0]?.count || 0,
        list: data || [],
      };
    } else {
      return {
        total: 0,
        list: [],
      };
    }
  }

  // 查找图片urls
  async findImageUrls({ id }) {
    const ids = Array.isArray(id) ? id : [id];
    const res = await Atlas.find(
      {
        _id: { $in: ids },
      },
      { url: 1, _id: 0 }
    );
    return res;
  }

  // 删除图片
  async deleteAtlasImages({ id }) {
    const ids = Array.isArray(id) ? id : [id];
    const res = await Atlas.deleteMany({
      _id: { $in: ids },
    });
    return res.deletedCount;
  }
}

module.exports = new AtlasServer();
