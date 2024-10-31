const { Classify } = require("../../models");

class ClassifyServer {
  // 根据标签名查找标签
  adminFindCLassify = async ({ classifyName }) => {
    const res = await Classify.findOne(
      { classifyName },
      { id: "$_id", _id: -1, classifyName: 1 }
    );
    return res;
  };

  // 创建分类
  async adminCreateClassify({ classifyName, articleIds, userIds }) {
    if (!classifyName) {
      throw new Error("没有传入classifyName");
    }

    const findOne = await new ClassifyServer().adminFindCLassify({
      classifyName,
    });

    // 判断分类名称是否重复
    if (findOne) {
      return false;
    } else {
      const res = await Classify.create({
        classifyName,
        addCount: 0,
        userIds: [],
        articleIds: [],
        addUserIds: [],
        createTime: new Date().valueOf(),
      });
      if (userIds && articleIds) {
        await new ClassifyServer().adminUpdateClassify({
          classifyNames: classifyName,
          articleIds,
          userIds,
        });
      }
      return res;
    }
  }

  // 更新分类
  async adminUpdateClassify({
    classifyNames,
    articleIds,
    userIds,
    isDelete = false,
  }) {
    const articleIdList =
      articleIds && Array.isArray(articleIds) ? articleIds : [articleIds];
    const classifyNameList =
      classifyNames && Array.isArray(classifyNames)
        ? classifyNames
        : [classifyNames];
    const bindUsers = userIds && Array.isArray(userIds) ? userIds : [userIds];

    // 判断是否是删除，如果是删除，则需要把相关的用户及文章从分类中删除
    const config = !isDelete
      ? {
          // 注意：如果要使用排序，$sort必须与$each一起使用才会生效
          // $addToSet会进行去重添加操作，$push不会进行去重添加操作
          $addToSet: {
            articleIds: { $each: articleIdList },
            userIds: { $each: bindUsers },
          },
          $set: {
            createTime: new Date().valueOf(),
          },
        }
      : {
          // 将符合条件的的文章及用户从 articleIds/userIds 中删除
          $pull: {
            articleIds: { $in: articleIds },
            userIds: { $in: bindUsers },
          },
        };

    const res = await Classify.updateMany(
      { classifyName: { $in: classifyNameList } },
      config
    );

    // 判断是否是删除文章，如果是删除则不创建分类
    if (!res.matchedCount && !isDelete) {
      await new ClassifyServer().adminCreateClassify({
        classifyName: classifyNames,
        articleIds,
        userIds,
      });
    } else {
      return res;
    }
  }

  // 添加分类
  async adminAddClassify({ id, bindUsers, type, userId }) {
    const config =
      type === "add"
        ? {
            $addToSet: {
              userIds: { $each: bindUsers },
              addUserIds: userId,
            },
          }
        : {
            $pull: {
              userIds: { $in: bindUsers },
              addUserIds: userId,
            },
          };
    const ids = id && Array.isArray(id) ? id : [id];
    await Classify.updateMany({ _id: { $in: ids } }, config);
  }

  // 删除文章分类
  async adminDelClassifys({ ids }) {
    const classifyIds = ids && Array.isArray(ids) ? ids : [ids];
    const res = await Classify.deleteMany({
      _id: { $in: classifyIds },
    });
    return classifyIds.length;
  }

  // 获取文章分类
  async adminGetClassifyList({ pageNo, pageSize }) {
    const project = {
      id: "$_id",
      _id: 0,
      icon: 1,
      classifyName: 1,
      articleCount: { $size: "$articleIds" }, // 获取classifyIds数组的数量
      userCount: { $size: "$userIds" }, // 获取userIds数组的数量
      createTime: 1,
      articleIds: 1,
      userIds: 1,
      addUserIds: 1,
    };

    const list = await Classify.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          data: [
            {
              $project: project,
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

module.exports = new ClassifyServer();
