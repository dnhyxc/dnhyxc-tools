const { Resume } = require("../../models");

class ResumeServer {
  async saveResumeInfo(params) {
    return await Resume.create({
      ...params,
      createTime: new Date().valueOf(),
    });
  };

  async updateResumeInfo(params) {
    return await Resume.findByIdAndUpdate(params.id, {
      ...params,
    }, { new: true });
  };

  async deleteResumeInfo({ userId, id }) {
    const ids = Array.isArray(id) ? id : [id];
    const res = await Resume.deleteMany({ _id: { $in: ids }, userId });
    return res;
  }

  async getResumeInfo({ userId, id }) {
    const res = await Resume.findOne({ _id: id, userId }, {
      id: '$_id',
      _id: 0,
      userId: 1,
      createTime: 1,
      elements: 1,
      resumeInfo: 1,
      customStyles: 1,
      customModuleCount: 1,
      baseLayoutType: 1,
      baseViewType: 1,
      titleStyle: 1,
    });
    return res;
  }

  async getResumeInfoList({ pageNo, pageSize, userId }) {
    const list = await Resume.aggregate([
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
                userId: 1,
                coverUrl: 1,
                'customStyles.type': 1,
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

module.exports = new ResumeServer();
