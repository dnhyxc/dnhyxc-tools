const { Draft } = require("../../models");
const { findUserById } = require("./user.service");
const { detailFields } = require("../../constant");

class draftServer {
  // 创建文章
  createDraft = async ({ ...params }) => {
    const userInfo = await findUserById(params.authorId);
    return await Draft.create({
      ...params,
      likeCount: 0,
      authorName: userInfo.username,
    });
  };

  // 根据文章id查找文章详情
  updateDraft = async ({ articleId: _id, ...params }) => {
    await Draft.updateOne({ _id }, { $set: params });
  };

  // 删除草稿
  deleteDraft = async (articleId) => {
    const res = await Draft.deleteOne({ _id: articleId });
    return res
  };

  // 获取草稿列表同时返回文章总条数
  getDraftListWithTotal = async ({ filterKey, pageNo, pageSize }) => {
    const list = await Draft.aggregate([
      { $match: filterKey },
      {
        $facet: {
          total: [{ $count: "count" }],
          data: [
            {
              $project: {
                _id: 0, // 默认情况下_id是包含的，将_id设置为0|false，则选择不包含_id，其他字段也可以这样选择是否显示。
                id: "$_id", // 将_id更名为classify
                title: 1,
                classify: 1,
                tag: 1,
                coverImage: 1,
                abstract: 1,
                authorId: 1,
                createTime: 1,
                authorName: 1,
                content: 1,
              },
            },
            { $sort: { createTime: -1 } },
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
  };

  // 获取草稿列表
  findDraftList = async ({ pageNo = 1, pageSize = 20, userId }) => {
    const filterKey = { authorId: userId };

    return await this.getDraftListWithTotal({
      filterKey,
      pageNo,
      pageSize,
    });
  };

  // 根据文章id查找草稿详情
  async findDraftById(id) {
    const article = await Draft.findById(id, detailFields);
    return article;
  }
}

module.exports = new draftServer();
