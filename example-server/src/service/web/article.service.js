const mongoose = require("mongoose");
const { Article, LikeArticle } = require("../../models");
const { findUserById, findOneUser } = require("./user.service");
const { adminUpdateClassify } = require("../admin/classify.service");
const { findCommentById } = require("./comments.service");
const { deleteFile } = require("../../controller/web/upload.controller");
const {
  anotherFields,
  detailFields,
  articleListRes,
} = require("../../constant");
const { getAdvancedSearchFilter, getSortType } = require("../../utils");

class articleServer {
  // 创建文章
  async createArticle({ ...params }) {
    const userInfo = await findUserById(params.authorId);
    const res = await Article.create({
      ...params,
      likeCount: 0,
      readCount: 0,
      collectCount: 0,
      authorName: userInfo.username,
    });
    if (params.classify && res._id) {
      // 创建文章时，更新分类文章数、添加数等
      await adminUpdateClassify({
        classifyNames: params.classify,
        articleIds: res._id,
        userIds: params.authorId,
      });
    }
    return res;
  }

  // 根据文章id查找文章详情
  async updateArticle({ articleId: _id, ...params }) {
    await Article.updateOne({ _id }, { $set: params });
    // 如果更新的封面图片有变化，删除旧的封面图片
    if (params.coverImage !== params.oldCoverImage) {
      // 删除前先查找是否有文章使用相同的封面图片
      const findArticle = await Article.findOne({ authorId: params.authorId, coverImage: params.oldCoverImage });
      if (findArticle) return;
      await deleteFile(params.oldCoverImage);
    }
  }

  // 根据封面图查找文章
  async findArticleByCoverImage({ coverImage, authorId }) {
    const article = await Article.findOne({ coverImage, authorId }, { _id: 0, id: '$_id', title: 1, coverImage: 1 });
    return article;
  }

  // 修改作者名称
  async updateAuthorName(authorId, authorName) {
    await Article.updateMany({ authorId }, { $set: { authorName } });
  }

  // 删除文章
  deleteArticles = async ({
    articleId,
    pageNo,
    pageSize,
    type,
    userId,
    tagName, // 表示标签页查询条件
    keyword, // 头部搜索框输入的搜索关键字
    classify, // 分类页面删除时选中的分类
    accessUserId, // 访问别人的主页时，需要使用accessUserId去检查点赞状态
    delType, // delType 为 '2' 时，说明删除的点赞文章
    authorPage, // 表示博主主页
    authorLike, // 表示博主主页点赞列表
    filterList, // 高级搜索条件
  }) => {
    // 头部搜索关键字不区分大小写
    const reg = (keyword && new RegExp(keyword, "i")) || "";
    // 处理头部搜索关键字
    const searchKey = {
      $or: [
        { title: { $regex: reg } },
        { tag: { $regex: reg } },
        { classify: { $regex: reg } },
        { authorId: { $regex: reg } },
        { authorName: { $regex: reg } },
        { abstract: { $regex: reg } },
      ],
    };

    // home 页面获取下一页第一条数据筛选条件
    const filters = {
      pageNo: pageNo + 1,
      pageSize,
      sortType: { createTime: -1 },
      userId,
      tagName,
      filter: keyword,
    };

    let filterKey = {};

    if (accessUserId) {
      await this.checkLikeStatus(accessUserId);
      filterKey = {
        $and: [{ isDelete: { $nin: [true] }, authorId: userId, ...searchKey }],
      };
    }

    // 删除文章分类数据
    if (classify) {
      await this.checkLikeStatus(userId);
      filterKey = {
        $and: [
          {
            isDelete: { $nin: [true] },
            classify,
            ...searchKey,
          },
        ],
      };
    }

    // 我的主页详情
    if (delType) {
      await this.checkLikeStatus(accessUserId || userId);
      // 返回文章列表前，首先根据userId检测点赞状态
      const likes = await this.getLikeArticles(userId);
      const articleIds = likes.map((i) => {
        return new mongoose.Types.ObjectId(i.articleId);
      });
      filterKey = {
        $and: [
          {
            isDelete: { $nin: [true] },
            _id: { $in: articleIds },
            ...searchKey,
          },
        ],
      };
    }

    // 博主主页，博主文章
    if (authorPage) {
      await this.checkLikeStatus(accessUserId || userId);
      // 查询 auth 为1 的博主信息
      const authorInfo = await findOneUser({ auth: 1 });
      filterKey = {
        $and: [
          {
            isDelete: { $nin: [true] },
            authorId: authorInfo?._id?.toString(),
            ...searchKey,
          },
        ],
      };
    }

    // 博主主页，博主点赞
    if (authorLike) {
      await this.checkLikeStatus(accessUserId || userId);
      const authorInfo = await findOneUser({ auth: 1 });

      const likes = await this.getLikeArticles(authorInfo?._id?.toString());
      const articleIds = likes.map((i) => {
        return new mongoose.Types.ObjectId(i.articleId);
      });

      filterKey = {
        $and: [
          {
            isDelete: { $nin: [true] },
            _id: { $in: articleIds },
            ...searchKey,
          },
        ],
      };
    }

    // 高级搜索
    if (filterList) {
      // 获取文章列表时，需要先根据userId判断文章点赞状态
      await this.checkLikeStatus(userId);
      filterKey = getAdvancedSearchFilter({ filterList, keyword });
    }

    const sortType = filterList ? getSortType(filterList) : { createTime: -1 };

    // 有type,代表是时间轴页面调的删除接口，时间没有分页，不需要获取下一页第一条数据
    let nextPageOne;
    if (!type) {
      if (classify || accessUserId || authorPage || authorLike) {
        const res = await this.getArticleListWithTotal({
          filterKey,
          pageNo: pageNo + 1,
          pageSize,
          sortType,
        });

        if (filterList?.includes("isLike")) {
          const likes = await this.getLikeArticles(userId);
          const articleIds = likes.map((i) => i.articleId);
          const list = res?.list.filter((i) =>
            articleIds.includes(i.id.toString())
          );
          nextPageOne = {
            total: list.length,
            list: list,
          };
        } else {
          nextPageOne = res;
        }
      } else {
        nextPageOne = await this.findArticles(filters);
      }
    } else {
      nextPageOne = { total: 0, list: [] };
    }

    await Article.updateOne(
      { _id: articleId },
      {
        $set: {
          isDelete: true,
        },
      }
    );

    return nextPageOne;
  };

  getLikeArticles = async (userId) => {
    const likes = await LikeArticle.find({ userId }).sort({ createTime: 1 });
    return likes;
  };

  // 查询用户是否点赞
  checkLikeStatus = async (userId) => {
    const likes = await LikeArticle.find({ userId });
    const likeFilter = likes.map((i) => i.articleId);
    await Article.updateMany(
      { _id: { $nin: likeFilter } },
      {
        $set: {
          isLike: false,
        },
      }
    );
    await Article.updateMany(
      { _id: { $in: likeFilter } },
      {
        $set: {
          isLike: true,
        },
      }
    );
    return likes;
  };

  // 计算文章评论数
  computeReplyCount = async (list, format) => {
    const articleIds = list.map((i) => i.id.toString());
    const res = await findCommentById(articleIds);
    const filterDelComments = res?.length > 0 && res.filter((i) => !i.isDelete);
    const comments =
      filterDelComments?.length > 0 &&
      filterDelComments.map((i) => {
        const comment = { ...i._doc };
        const filterReplyList = comment.replyList.filter((i) => !i.isDelete);
        comment.commentCount = filterReplyList.length + 1;
        return comment;
      });
    list.forEach((i) => {
      i.commentCount = 0;
      comments?.length > 0 &&
        comments.forEach((j) => {
          if (format) {
            i.createDate = new Date(i.createTime).getFullYear();
          }
          if (j.articleId === i.id.toString()) {
            i.commentCount += j.commentCount;
          }
        });
    });
    return list;
  };

  // 获取文章列表同时返回文章总条数
  getArticleListWithTotal = async ({
    filterKey,
    pageNo,
    pageSize,
    sortType = {},
    hot,
  }) => {
    const list = await Article.aggregate([
      { $match: filterKey },
      {
        $facet: {
          total: [{ $count: "count" }],
          data: [
            {
              $project: articleListRes,
            },
            {
              $sort: Object.keys(sortType).length
                ? { isTop: -1, ...sortType } // 如果有 sortType，则按照 sortType 排序
                : hot // 如果有 hot，则按照最热（readCount）排序
                  ? { isTop: -1, readCount: -1, likeCount: -1 }
                  : { isTop: -1, createTime: -1, likeCount: -1 },
            },
            { $skip: (pageNo - 1) * pageSize },
            { $limit: !Object.keys(sortType).length ? pageSize : 1 },
          ],
        },
      },
    ]);

    if (list?.length) {
      const { total, data } = list[0];
      // 获取文章评论数
      const res = await this.computeReplyCount(data);
      return {
        total: total[0]?.count || 0,
        list: res || [],
      };
    } else {
      return {
        total: 0,
        list: [],
      };
    }
  };

  // 获取文章列表
  findArticles = async ({
    pageNo = 1,
    pageSize = 20,
    filter, // keyword 关键词搜索
    userId,
    tagName, // 选择的标签
    sortType,
    hot, // 是否查最热文章
  }) => {
    // 获取文章列表时，需要先根据userId判断文章点赞状态
    await this.checkLikeStatus(userId);
    let filterKey;
    const reg = (filter && new RegExp(filter, "i")) || "";
    // 不区分大小写
    filterKey = {
      $or: [
        { title: { $regex: reg } },
        { tag: { $regex: reg } },
        { classify: { $regex: reg } },
        { authorId: { $regex: reg } },
        { authorName: { $regex: reg } },
        { abstract: { $regex: reg } },
      ],
      isDelete: { $nin: [true] },
    };

    // 查询对应标签文章
    if (tagName) {
      filterKey.tag = tagName;
    }
    return await this.getArticleListWithTotal({
      filterKey,
      pageNo,
      pageSize,
      sortType,
      hot,
    });
  };

  // 计算文章阅读数
  computeArticleReadCount = async (id) => {
    await Article.updateOne(
      { _id: id },
      {
        $inc: {
          readCount: 1,
        },
      }
    );
  };

  // 根据文章id查找文章详情
  findArticleById = async (id, isEdit) => {
    // 如果是编辑时调用的详情，则不进行阅读数的更改
    if (!isEdit) {
      await this.computeArticleReadCount(id);
    }
    const article = await Article.findById(id, detailFields);
    if (article) {
      const userInfo = article && (await findUserById(article.authorId));
      return {
        ...article._doc,
        authorName: userInfo?.username,
        headUrl: userInfo?.headUrl,
      };
    } else {
      return null;
    }
  };

  // 获取点赞文章
  // async getLikeArticleList({ pageNo = 1, pageSize = 20, userId }) {
  //   // 返回文章列表前，首先根据userId检测点赞状态
  //   const likes = await this.getLikeArticles(userId);
  //   const articleIds = likes.map((i) => {
  //     return new mongoose.Types.ObjectId(i.articleId);
  //   });
  //   const filterKey = {
  //     $and: [{ isDelete: { $nin: [true] }, _id: { $in: articleIds } }],
  //   };
  //   const sortType = { createTime: -1 };
  //   const nextPageOne = await this.getArticleListWithTotal({
  //     filterKey,
  //     pageNo,
  //     pageSize,
  //     sortType,
  //   });
  //   return nextPageOne;
  // }

  // 根据文章id查找文章详情
  async likeArticle({
    id: _id,
    likeStatus,
    // userId,
    // authorId,
    // pageNo,
    // pageSize,
  }) {
    const { likeCount } = await Article.findById(_id);
    const res = await Article.findOneAndUpdate(
      { _id },
      {
        $inc: { likeCount: likeStatus ? likeCount <= 0 ? 0 : -1 : 1 },
        $set: {
          isLike: likeStatus ? false : true,
        },
      },
      { returnDocument: 'after' } // 返回更新后的数据
    );
    return {
      isLike: likeStatus ? false : true,
      likeCount: res.likeCount,
    };

    // //如果authorId有值，说明是从博主主页进行点赞的操作，likeStatus是true，说明是需要取消点赞
    // if (authorId && likeStatus) {
    //   const res = await new articleServer().getLikeArticleList({
    //     pageNo: pageNo + 1,
    //     pageSize,
    //     userId: authorId,
    //   });
    //   return {
    //     nextPageOne: res.list,
    //     total: res.total + 1,
    //     likeStatus: likeStatus ? false : true,
    //   };
    // } else {
    //   return {
    //     likeStatus: likeStatus ? false : true,
    //   };
    // }
  }

  // 随机获取文章
  getArticleByRandom = async (userId) => {
    // 获取文章列表时，需要先根据userId判断文章点赞状态
    await this.checkLikeStatus(userId);
    const res = await Article.aggregate([
      {
        $match: {
          isDelete: { $nin: [true] },
          // 匹配点赞大于等一1或者评论大于等于1的数据
          $or: [{ likeCount: { $gte: 1 } }, { readCount: { $gte: 1 } }],
        },
      },
      // 随机获取5条数据
      { $sample: { size: 5 } },
      {
        $project: anotherFields,
      },
      { $sort: { createTime: -1 } },
    ]);
    return res;
  };

  // 清空所有文章
  async delAllArticle() {
    await Article.deleteMany({});
  }

  // 处理上下页参数
  getParams = async (id, props, articleId) => {
    const { classify, userId, tagName, from, selectKey, articleIds } = props;
    if (from === "classify" && classify) {
      return { _id: id, isDelete: { $nin: [true] }, classify };
    }
    if ((from === "tag" || from === "tagList") && tagName) {
      return { _id: id, isDelete: { $nin: [true] }, tag: tagName };
    }
    if (from === "timeline" && userId) {
      return { _id: id, isDelete: { $nin: [true] }, authorId: userId };
    }
    if (from === "personal" && selectKey === "1" && userId) {
      return { _id: id, isDelete: { $nin: [true] }, authorId: userId };
    }
    if (from === "personal" && selectKey === "2" && userId) {
      // 返回文章列表前，首先根据userId检测点赞状态
      const likes = await this.getLikeArticles(userId);
      const articleIds = likes.map(
        (i) => new mongoose.Types.ObjectId(i.articleId)
      );
      return {
        _id: { $in: articleIds, ...id },
        isDelete: { $nin: [true] },
      };
    }
    if (from === "author" && selectKey === "1") {
      // 查询 auth 为1 的博主信息
      const authorInfo = await findOneUser({ auth: 1 });
      return {
        _id: id,
        isDelete: { $nin: [true] },
        authorId: authorInfo?._id?.toString(),
      };
    }
    if (from === "author" && selectKey === "2") {
      // 查询 auth 为1 的博主点赞
      const authorInfo = await findOneUser({ auth: 1 });
      const userId = authorInfo?._id?.toString();
      const likes = await this.getLikeArticles(userId);
      const articleIds = likes.map(
        (i) => new mongoose.Types.ObjectId(i.articleId)
      );
      return {
        _id: { $in: articleIds, ...id },
        isDelete: { $nin: [true] },
      };
    }
    if (from === "author" && selectKey === "3") {
      const authorInfo = await findOneUser({ auth: 1 });
      const userId = authorInfo?._id?.toString();
      return { _id: id, isDelete: { $nin: [true] }, authorId: userId };
    }
    if (from === "collect") {
      const index = articleIds.findIndex((i) => i === articleId);

      if (id.$gt === articleId) {
        return {
          _id: articleIds[index - 1],
          isDelete: { $nin: [true] },
        };
      }

      if (id.$lt === articleId) {
        return {
          _id: articleIds[index + 1],
          isDelete: { $nin: [true] },
        };
      }
    }
    return { _id: id, isDelete: { $nin: [true] } };
  };

  // 获取上一篇文章
  getPrevArticle = async (id, props) => {
    const filter = await this.getParams({ $gt: id }, props, id);
    const res = Article.findOne(filter, anotherFields)
      // 获取上一篇需要注意排序，需要将createTime设置为正序排列
      .sort({ _id: 1, createTime: 1 })
      .limit(1);

    return res;
  };

  // 获取下一篇文章
  getNextArticle = async (id, props) => {
    const filter = await this.getParams({ $lt: id }, props, id);
    const res = Article.findOne(filter, anotherFields)
      // 获取上一篇需要注意排序，需要将createTime设置为倒叙序排列
      .sort({ _id: -1, createTime: -1 })
      .limit(1);

    return res;
  };

  // 获取文章总条数
  async getArticleTotal(filter) {
    const res = Article.find(filter).count();
    return res;
  }

  // 高级搜索
  searchArticles = async ({
    pageNo = 1,
    pageSize = 20,
    keyword,
    userId,
    filterList,
  }) => {
    // 获取文章列表时，需要先根据userId判断文章点赞状态
    await this.checkLikeStatus(userId);

    const filterKey = getAdvancedSearchFilter({ filterList, keyword });

    const sortType = getSortType(filterList);

    const res = await this.getArticleListWithTotal({
      filterKey,
      pageNo,
      pageSize,
      sortType,
    });

    if (filterList.includes("isLike")) {
      const likes = await this.getLikeArticles(userId);
      const articleIds = likes.map((i) => i.articleId);
      const list = res?.list.filter((i) =>
        articleIds.includes(i.id.toString())
      );
      return {
        total: list.length,
        list: list,
      };
    } else {
      return res;
    }
  };

  // 设置文章收藏数
  updateCollectCount = async ({ articleId, type }) => {
    const filter = Array.isArray(articleId) ? articleId : [articleId];

    const res = await Article.updateMany(
      { _id: filter },
      // $inc：自增自减运算符，传入正值为自增，负值为自减
      {
        $inc: {
          collectCount: type ? 1 : -1,
        },
      }
    );

    return res;
  };

  // 批量设置文章收藏数
  updateArticlesCollectCount = async ({ articleIds, type }) => {
    const res = await Article.updateMany(
      { _id: { $in: articleIds } },
      // $inc：自增自减运算符，传入正值为自增，负值为自减
      {
        $inc: {
          collectCount: type ? 1 : -1,
        },
      }
    );
    return res;
  };

  // 获取分类及标签相似的文章
  getLikenessArticles = async ({ classify, tag, id }) => {
    const classifyReg = (classify && new RegExp(classify, "i")) || "";
    const tagReg = (tag && new RegExp(tag, "i")) || "";

    const res = await Article.aggregate([
      {
        $match: {
          $or: [
            { classify: { $regex: classifyReg } },
            { tag: { $regex: tagReg } },
          ],
          _id: { $nin: [new mongoose.Types.ObjectId(id)] },
          isDelete: { $nin: [true] },
        },
      },
      // 随机获取2条数据
      { $sample: { size: 2 } },
      {
        $project: anotherFields,
      },
    ]);

    return res;
  };

  // 获取文章的点赞状态
  checkArticleLikeStatus = async ({ userId, id }) => {
    const likeArticle = await LikeArticle.findOne({ userId, articleId: id });
    if (likeArticle) {
      return {
        id,
        isLike: true,
      };
    }
    return {
      id,
      isLike: false,
    };
  };

  // 获取最新及最多点赞的文章
  findMostLikeAndNewArticles = async () => {
    // 获取最新发布的一篇文章
    const latestArticlePromise = Article.findOne(
      { isDelete: { $nin: [true] } },
      anotherFields
    )
      .sort({ createTime: -1 })
      .limit(1);

    // 获取阅读数最多的一篇文章
    const mostLikedArticlePromise = Article.findOne(
      {
        isDelete: { $nin: [true] },
      },
      anotherFields
    )
      .sort({ readCount: -1 })
      .limit(1);

    const res = await Promise.all([
      latestArticlePromise,
      mostLikedArticlePromise,
    ]);

    return res;
  };
}

module.exports = new articleServer();
