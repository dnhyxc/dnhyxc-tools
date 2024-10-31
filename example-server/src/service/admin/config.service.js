const { PageConfig, Themes } = require("../../models");

class PageConfigServer {
  // 创建布局配置
  async adminCreateConfig({
    bindUserIds,
    userId,
    layout,
    layoutSet,
    cardLayout,
    coverImgs,
  }) {
    // 删除之前绑定的账号配置
    await PageConfig.deleteMany({
      bindUserId: { $nin: bindUserIds },
    });

    const findBinds = await PageConfig.find({
      adminUserId: userId,
      bindUserId: { $in: bindUserIds },
    });

    // 过滤出已经绑定过的账号
    const oldBindUserIds = findBinds.map((i) => i.bindUserId);

    // 过滤出原有绑定的账号进行更新，新绑定的进行创建
    const newBinds = bindUserIds.filter((i) => !oldBindUserIds.includes(i));

    if (findBinds.length) {
      await PageConfig.updateMany(
        { adminUserId: userId, bindUserId: { $in: bindUserIds } },
        {
          $set: {
            layout, // 布局选择：1 上下布局，2 左右布局
            layoutSet, // 是否开启布局切换：1 开启，2 不开启
            cardLayout, // 卡片展示控制：1 左右布局模式，2 上下布局模式
            coverImgs, // 首页封面图（默认选择两张）
            createTime: new Date().valueOf(),
          },
        }
      );
    }

    if (newBinds.length) {
      // 根据绑定的前台账户（可能同时绑定多个前台账户）生成对应的布局配置
      const newConfigList = newBinds.map((i) => ({
        bindUserId: i,
        adminUserId: userId,
        layout, // 布局选择：1 上下布局，2 左右布局
        layoutSet, // 是否开启布局切换：1 开启，2 不开启
        cardLayout, // 卡片展示控制：1 左右布局模式，2 上下布局模式
        coverImgs, // 首页封面图（默认选择两张）
        createTime: new Date().valueOf(),
      }));

      await PageConfig.create(newConfigList);
    }
  }

  // 创建主题配置列表
  async adminCreateThemes(params) {
    const res = await Themes.create({
      ...params,
      createTime: new Date().valueOf(),
    });
    return res;
  }

  // 创建主题配置列表
  async adminFindTheme({ uid, userId }) {
    const res = await Themes.findOne({ uid, userId }, { id: "$_id", _id: 0 });
    return res;
  }

  // 获取创建的主题
  async adminGetThemesWithTotal({
    pageNo,
    pageSize,
    userId,
    type = "all",
    sortByTime = true,
    isAuth,
  }) {
    const filters =
      type !== "all"
        ? {
            $or: [
              // 查询数组对象（powerUsers:[{username:'xxx',id:'1'},{username:'xxx',id:'2'}]）中id为userId的某一项
              { auth: { $elemMatch: { id: userId } } },
              { auth: { $size: 0 } }, // 查询powerUsers为空的
            ],
          }
        : isAuth
        ? {}
        : { userId };

    const skipRule = pageSize
      ? [{ $skip: (pageNo - 1) * pageSize }, { $limit: pageSize }]
      : [];

    const facetDataRule = [
      {
        $project: {
          id: "$_id",
          _id: 0,
          name: 1,
          size: 1,
          type: 1,
          url: 1,
          createTime: 1,
          bindUserIds: 1,
          userId: 1,
        },
      },
      {
        $sort: sortByTime ? { createTime: -1 } : { sort: 1, createTime: -1 },
      },
    ];

    if (type === "all") {
      facetDataRule.concat(skipRule);
    }

    const list = await Themes.aggregate([
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
}

module.exports = new PageConfigServer();
