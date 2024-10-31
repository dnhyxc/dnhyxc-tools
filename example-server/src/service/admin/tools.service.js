const { Tools, ToolSort } = require("../../models");

class ToolsServer {
  // 添加工具
  async adminAddTools({ toolName, toolHref, toolUrl, powerUsers, sort }) {
    // 删除之前绑定的账号配置
    const res = await Tools.create({
      toolName,
      toolHref,
      toolUrl,
      powerUsers,
      sort,
      createTime: new Date().valueOf(),
    });
    return res;
  }

  // 获取工具列表
  async adminGetToolListWithTotal({ pageNo, pageSize, userId, type = "all", sortByTime }) {
    const filters =
      type !== "all"
        ? {
          $or: [
            // 查询数组对象（powerUsers:[{username:'xxx',id:'1'},{username:'xxx',id:'2'}]）中id为userId的某一项
            { powerUsers: { $elemMatch: { id: userId } } },
            { powerUsers: { $size: 0 } }, // 查询powerUsers为空的
          ],
        }
        : {};

    const skipRule = [{ $skip: (pageNo - 1) * pageSize }, { $limit: pageSize }];

    let facetDataRule = [
      {
        $project: {
          id: "$_id",
          _id: 0,
          toolName: 1,
          toolHref: 1,
          toolUrl: 1,
          powerUsers: 1,
          createTime: 1,
          sort: 1,
        },
      },
      {
        $sort: sortByTime ? { createTime: -1 } : { sort: 1, createTime: -1 },
      },
    ];

    // 判断是否是否是后台获取, type 为 all 就表示是后台获取
    if (type === "all") {
      facetDataRule = [...facetDataRule, ...skipRule];
    }

    const list = await Tools.aggregate([
      {
        $match: filters,
      },
      {
        $facet: {
          total: [{ $count: "count" }],
          data: facetDataRule,
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

  // 更新工具
  async adminUpdateTools({
    id,
    toolName,
    toolHref,
    toolUrl,
    powerUsers,
    sortInfo = null,
  }) {
    if (sortInfo) {
      const updateList = await sortInfo.map(async (item) => {
        return await Tools.updateMany({ _id: item.id }, { $set: { sort: item.sort } });
      });
      const res = await Promise.all(updateList)
      return res;
    } else {
      const res = await Tools.updateMany(
        {
          _id: id,
        },
        {
          $set: {
            toolName,
            toolHref,
            toolUrl,
            powerUsers,
          },
        }
      );
      return res.modifiedCount;
    }
  }

  // 删除工具
  async adminDeleteTools({ ids }) {
    const filterIds = Array.isArray(ids) ? ids : [ids];
    const res = await Tools.deleteMany({
      _id: { $in: filterIds },
    });

    return res.deletedCount;
  }

  // 添加工具排序
  async adminCreateToolSort({ userId, sortInfo }) {
    const findOne = await ToolSort.findOne({ userId })
    if (!findOne) {
      // 删除之前绑定的账号配置
      const res = await ToolSort.create({
        userId,
        sortInfo,
        createTime: new Date().valueOf(),
      });
      return res;
    } else {
      const res = await ToolSort.updateOne({ userId }, {
        $set: {
          sortInfo,
          createTime: new Date().valueOf()
        }
      })
      if (res.modifiedCount) {
        return {
          userId,
          sortInfo
        }
      }
    }
  }

  // 更新工具排序
  async adminUpdateToolSort({ userId, sortInfo }) {
    const res = await ToolSort.updateOne({ userId }, {
      $set: {
        sortInfo,
        createTime: new Date().valueOf()
      }
    })
    return res.modifiedCount;
  }

  // 获取工具排序列表
  async adminGetToolSort({ userId }) {
    const res = await ToolSort.findOne({ userId })
    return res;
  }
}

module.exports = new ToolsServer();
