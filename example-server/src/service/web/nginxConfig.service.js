const { NginxConfig } = require("../../models");

class nginxConfigServer {
  async saveNginxConfig(params) {
    if (!params.id) {
      return await NginxConfig.create({
        ...params,
        createTime: new Date().valueOf(),
      });
    } else {
      return await NginxConfig.findByIdAndUpdate(params.id, {
        ...params,
      }, { new: true });
    }
  };

  async updateNginxConfig(params) {
    return await NginxConfig.findByIdAndUpdate(params.id, {
      ...params,
    }, { new: true });
  };

  async deleteNginxConfig({ userId, id }) {
    const ids = Array.isArray(id) ? id : [id];
    const res = await NginxConfig.deleteMany({ _id: { $in: ids }, userId });
    return res;
  }

  async getNginxConfigList({ pageNo, pageSize, userId }) {
    const list = await NginxConfig.aggregate([
      {
        $match: { userId }
      },
      {
        $facet: {
          total: [{ $count: "count" }],
          data: [
            {
              $project: {
                id: "$_id",
                _id: 0,
                createTime: 1,
                config: 1,
                userId: 1,
                abstract: 1
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
}

module.exports = new nginxConfigServer();
