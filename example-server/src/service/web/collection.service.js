const mongoose = require("mongoose");
const { Collection } = require("../../models");
const { collectionRes } = require("../../constant");
const {
  getArticleListWithTotal,
  checkLikeStatus,
  updateCollectCount,
} = require("./article.service");

class collectionServer {
  // 创建收藏集
  createCollection = async ({ ...params }) => {
    return await Collection.create({
      ...params,
      articleIds: [],
      createTime: new Date().valueOf(),
    });
  };

  // 根据收藏集名称查询 filter: {_id: params.id}
  findOneCollection = async (filter) => {
    const res = await Collection.findOne(filter, collectionRes);
    return res;
  };

  // 分页获取收藏集方法
  getCollectionWithTotal = async ({
    pageNo,
    pageSize,
    userId,
    isVisitor,
    getOne,
  }) => {
    const filter = { userId };

    if (isVisitor) {
      filter.status = 1;
    }

    const list = await Collection.aggregate([
      { $match: filter },
      {
        $facet: {
          total: [{ $count: "count" }],
          data: [
            {
              $project: collectionRes,
            },
            {
              $sort: { createTime: -1 },
            },
            { $skip: (pageNo - 1) * pageSize },
            { $limit: !getOne ? pageSize : 1 },
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

  // 分页获取收藏集
  getCollectionList = async ({ pageNo, pageSize, userId, isVisitor }) => {
    return await this.getCollectionWithTotal({
      pageNo,
      pageSize,
      userId,
      isVisitor,
    });
  };

  // 收藏文章
  collectArticles = async ({ ids, articleId, userId, isMove = false }) => {
    // 如果isMove是true，说明是转移文章，收藏数不需要变更
    if (!isMove) {
      await updateCollectCount({ articleId, type: true });
    }
    const res = Collection.updateMany(
      { _id: { $in: ids }, userId },
      {
        $set: {
          createTime: new Date().valueOf(),
        },
        // 注意：如果要使用排序，$sort必须与$each一起使用才会生效
        // $addToSet会进行去重添加操作，$push不会进行去重添加操作
        $addToSet: {
          articleIds: { $each: [articleId] },
          $sort: { date: -1 },
        },
      }
    );

    return res;
  };

  // 获取文章收藏状态
  checkCollectionStatus = async ({ articleId, userId }) => {
    if (!userId) return;
    const res = await Collection.find(
      // 查询字段中的数组中是否包含某值，找出articleIds数组中是否包含当前的articleId
      { userId, articleIds: { $elemMatch: { $eq: articleId } } },
      collectionRes
    );
    if (res?.length) {
      return res[0];
    }
  };

  // 取消收藏
  cancelCollected = async ({ articleId, userId }) => {
    await updateCollectCount({ articleId, type: false });
    const res = Collection.updateMany(
      // 查询条件为，查找当前用户下的，并且articleIds数组中包含articleId的所有数据
      { userId, articleIds: { $elemMatch: { $eq: articleId } } },
      // 向查找到的Collection中的articleIdst数组中插入一篇文章
      // 注意：如果要使用排序，$sort必须与$each一起使用才会生效
      {
        $pull: { articleIds: articleId },
        $inc: {
          count: -1,
        },
        $set: {
          createTime: new Date().valueOf(),
        },
      }
    );
    return res;
  };

  // 获取我的收藏文章总数
  getCollectedTotal = async ({ userId, status }) => {
    // 如果有status，则说明只查公开的收藏集
    const match = status ? { userId, status: status } : { userId };
    const res = await Collection.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          _id: 0,
          name: 1,
          total: { $size: "$articleIds" },
        },
      },
    ]);
    return res;
  };

  // 获取收藏集的总数
  getCollectTotal = async ({ userId, status }) => {
    // 如果有status，则说明只查公开的收藏集
    const filter = status ? { userId, status } : { userId };
    const total = await Collection.find(filter).count();
    return total;
  };

  // 删除收藏集
  delCollection = async ({ userId, id, pageNo, pageSize }) => {
    const res = await this.findOneCollection({ _id: id });

    res.articleIds.forEach(async (articleId) => {
      // 查找所有包含articleId的收藏集
      const collectIds = await Collection.find(
        {
          articleIds: { $elemMatch: { $eq: articleId } },
        },
        { _id: 1 }
      );

      // 过滤掉当前需要删除的收藏集id
      if (collectIds?.length) {
        const filterCollectIds = collectIds.filter(
          (i) => i._id?.toString() !== id // 需要删除的收藏集id
        );

        // 判断是否还有包含该articleId的收藏集，如果没有则，articleId这篇文章需要更改收藏数量
        if (!filterCollectIds?.length) {
          await updateCollectCount({
            articleId: articleId,
            type: false,
          });
        }
      }
    });

    // 删除时先获取下一页的第一条数据，防止删除当前数据后，下一页第一条数据跑到上一页无法获取到
    if (pageNo && pageSize) {
      const nextPageOne = await this.getCollectionWithTotal({
        pageNo: pageNo + 1,
        pageSize,
        userId,
        getOne: true,
      });
      await Collection.deleteOne({ _id: id, userId });
      return nextPageOne;
    } else {
      await Collection.deleteOne({ _id: id, userId });
    }
  };

  // 更新收藏集
  updateCollection = async ({ id, ...props }) => {
    return await Collection.updateOne(
      { _id: id },
      {
        $set: { ...props, createTime: new Date().valueOf() },
      }
    );
  };

  // 获取收藏集中收藏的文章
  getCollectArticles = async ({ articleIds, pageNo, pageSize, userId }) => {
    // 返回文章列表前，首先根据userId检测点赞状态
    await checkLikeStatus(userId);
    // 需要将字符串id转为mongoose中的id类型才能查到对应的文章
    const ids = articleIds.map((i) => new mongoose.Types.ObjectId(i));
    const filterKey = {
      _id: { $in: ids },
    };
    return await getArticleListWithTotal({
      filterKey,
      pageNo,
      pageSize,
    });
  };

  // 删除收藏集文章
  removeCollectArticle = async ({ articleId, userId, id, isMove = false }) => {
    // 查询条件为，查找当前用户下的，并且articleIds数组中包含articleId的所有数据
    let filters = { _id: id, articleIds: { $elemMatch: { $eq: articleId } } };

    const articleIds =
      articleId && Array.isArray(articleId) ? articleId : [articleId];

    if (!isMove) {
      // 如果是点击的是移除（非转移）的话，需要将所有收藏集中收藏的该文章都统统移除掉，因此，需要把唯一的id查找条件删除
      filters = { articleIds: { $in: articleIds } };
      // filters = { articleIds: { $elemMatch: { $eq: articleId } } };
      // 更改该文章的收藏次数
      await updateCollectCount({ articleId, type: false });
    }

    const res = await Collection.updateMany(filters, {
      // 删除与articleIds匹配的文章列表
      $pull: { articleIds: { $in: articleIds } },
      $inc: {
        count: -1,
      },
    });

    return res;
  };
}

module.exports = new collectionServer();
