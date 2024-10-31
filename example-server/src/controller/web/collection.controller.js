const {
  createCollection,
  getCollectionList,
  collectArticles,
  checkCollectionStatus,
  cancelCollected,
  getCollectedTotal,
  delCollection,
  updateCollection,
  findOneCollection,
  getCollectArticles,
  removeCollectArticle,
  getCollectTotal,
} = require("../../service");
const { databaseError } = require("../../constant");

class collectionController {
  // 创建文章
  async createCollectionCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await createCollection(params);
      const data = {
        id: res._id,
        name: res.name,
        desc: res.desc,
        status: res.status,
        createTime: res.createTime,
      };
      ctx.body = {
        code: 200,
        success: true,
        message: "新建收藏集成功",
        data,
      };
    } catch (error) {
      console.error("createCollectionCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取收藏集列表
  async getCollectionListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getCollectionList(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取收藏集列表成功",
        data: res,
      };
    } catch (error) {
      console.error("getCollectionListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 收藏文章
  async collectArticlesCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      await collectArticles(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "收藏成功，记得时常温习哦！",
        data: params.articleId,
      };
    } catch (error) {
      console.error("collectArticlesCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取文章收藏状态
  async checkCollectionStatusCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await checkCollectionStatus(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取收藏状态成功",
        data: {
          ...res?._doc,
          collected: !!res,
        },
      };
    } catch (error) {
      console.error("collectArticlesCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取文章收藏状态
  async cancelCollectedCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await cancelCollected(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "取消收藏成功",
        data: res.modifiedCount,
      };
    } catch (error) {
      console.error("cancelCollectedCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取收藏的文章总数
  async getCollectedTotalCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getCollectedTotal(params);
      const collectedList = res?.length && res.filter((i) => i.total);
      const total =
        (collectedList?.length &&
          collectedList.reduce((prev, cur) => (prev += cur.total), 0)) ||
        0;
      ctx.body = {
        code: 200,
        success: true,
        message: "获取收藏文章总和成功",
        data: { total },
      };
    } catch (error) {
      console.error("getCollectedTotalCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取收藏集收藏文章列表
  async getCollectTotalCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getCollectTotal(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取收藏集总数成功",
        data: res,
      };
    } catch (error) {
      console.error("getCollectTotalCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 删除收藏集
  async delCollectionCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await delCollection(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "删除收藏集成功",
        data: res,
      };
    } catch (error) {
      console.error("delCollectionCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 更新收藏集
  async updateCollectionCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      await updateCollection(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "更新收藏集成功",
        data: params?.id,
      };
    } catch (error) {
      console.error("delCollectionCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取收藏集详情
  async getCollectInfoCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await findOneCollection({ _id: params.id });
      ctx.body = {
        code: 200,
        success: true,
        message: "获取收藏集详情成功",
        data: res,
      };
    } catch (error) {
      console.error("getCollectInfoCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取收藏集收藏文章列表
  async getCollectArticlesCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getCollectArticles(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取收藏集文章列表成功",
        data: res,
      };
    } catch (error) {
      console.error("getCollectArticlesCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取收藏集收藏文章列表
  async removeCollectArticleCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      await removeCollectArticle(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "移除成功",
        data: params.articleId,
      };
    } catch (error) {
      console.error("removeCollectArticleCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new collectionController();
