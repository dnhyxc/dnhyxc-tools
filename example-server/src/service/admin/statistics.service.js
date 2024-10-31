const { Article, User } = require("../../models");
const { articleListRes } = require("../../constant");

class statisticsServer {
  // 获取文章统计
  async adminGetArticlesStatistics() {
    const list = await Article.aggregate([
      {
        $match: {
          $and: [{ isDelete: { $nin: [true] } }],
        },
      },
      {
        $project: {
          year: {
            $dateToString: {
              // "%Y-%m-%d" => 2022-07-21
              format: "%Y", // 只解析年
              date: { $add: [new Date(0), "$createTime"] },
            },
          },
          month: {
            $dateToString: {
              // "%Y-%m-%d" => 2022-07-21
              format: "%m", // 解析年月
              date: { $add: [new Date(0), "$createTime"] },
            },
          },
          title: 1,
          classify: 1,
          tag: 1,
          coverImage: 1,
          abstract: 1,
          authorId: 1,
          authorName: 1,
          isLike: 1,
          likeCount: 1,
          createTime: 1,
          readCount: 1,
          comments: 1,
          isTop: 1,
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
          },
          count: { $sum: 1 },
          articleInfo: {
            $push: {
              title: "$title",
              readCount: "$readCount",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          count: 1,
          articleInfo: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    return list;
  }

  // 获取用户注册情况统计
  async adminGetRegisterStatistics() {
    const currentYear = new Date().getFullYear();

    const list = await User.aggregate([
      {
        $match: {
          // isDelete: { $nin: [true] },
          // 查询当前年的数据
          registerTime: {
            $gte: new Date(`${currentYear - 1}-01-01`).getTime(),
            $lt: new Date(`${currentYear + 1}-01-01`).getTime(),
          },
        },
      },
      {
        $project: {
          month: {
            $dateToString: {
              // "%Y-%m-%d" => 2022-07-21
              format: "%Y-%m", // 解析年月
              date: { $add: [new Date(0), "$registerTime"] },
            },
          },
        },
      },
      {
        $group: {
          _id: {
            month: "$month",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          count: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    return list;
  }

  // 获取作者人数
  async adminGetAuhthorList() {
    const list = await Article.aggregate([
      {
        $match: {
          // isDelete: { $nin: [true] },
        },
      },
      {
        $project: {
          authorName: "$authorName",
        },
      },
      {
        $group: {
          _id: {
            authorName: "$authorName",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          authorName: "$_id.authorName",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    return list;
  }

  // 查询阅读数最大的两篇文章
  async adminGetPopularArticles({ limit = 1 }) {
    const res = await Article.find({}, articleListRes)
      .sort({ readCount: -1 })
      .limit(limit);

    return res;
  }
}

module.exports = new statisticsServer();
