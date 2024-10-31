const { Deploy, DeployServer } = require("../../models");
const { deployFields, serverFields } = require("../../constant");

class deployServer {
  // 新增或者更新服务器信息
  async createDeployServer({ ...params }) {
    if (!params.id) {
      return await DeployServer.create({
        ...params,
        createTime: new Date().valueOf(),
      });
    } else {
      return await DeployServer.findByIdAndUpdate(params.id, {
        ...params,
      }, { new: true });
    }
  };

  // 获取服务器信息
  async getDeployServerInfo({ userId }) {
    const res = await DeployServer.find({ userId }, serverFields);
    if (res.length) {
      return res[0];
    }
    return {}
  }

  async findProjectByName({ projectName, userId }) {
    return await Deploy.findOne({ projectName, userId }, deployFields);
  }

  async createProject({ ...params }) {
    const findProject = await new deployServer().findProjectByName(params);
    if (findProject) {
      return {
        created: true,
        ...findProject._doc
      };
    }
    return await Deploy.create({
      ...params,
      createTime: new Date().valueOf(),
    });
  };

  async findProjectById(id) {
    return await Deploy.findById(id);
  }

  async updateProject({ id, ...params }) {
    const res = await Deploy.findByIdAndUpdate(id, {
      ...params,
      createTime: new Date().valueOf(),
    }, { new: true, projection: deployFields });
    return res;
  }

  async deleteProject({ id }) {
    const res = await Deploy.deleteOne({ _id: id });
    return res;
  }

  async getProjectList({ pageNo, pageSize, userId }) {
    const list = await Deploy.aggregate([
      {
        $match: { userId }
      },
      {
        $facet: {
          total: [{ $count: "count" }],
          data: [
            {
              $project: deployFields,
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

module.exports = new deployServer();
