const { Article, Comments } = require("../../models");
const { findUserById } = require("../web/user.service");
const { adminUpdateClassify } = require("./classify.service");
const { detailFields, articleListRes } = require("../../constant");
const { deleteFile } = require("../../controller/web/upload.controller");

class articleServer {
  // 创建文章
  async adminCreateArticle({ ...params }) {
    const userInfo = await findUserById(params.authorId);
    const article = await Article.create({
      ...params,
      likeCount: 0,
      authorName: userInfo.username,
    });
    await adminUpdateClassify({
      classifyNames: params.classify,
      articleIds: article._id,
      userIds: params.authorId,
    });
    return article;
  }

  // 根据文章id更新
  async adminUpdateArticle({ articleId: _id, ...params }) {
    // 如果isTop传的是0，则删除isTop字段。以防排序出现问题
    const paramsData =
      params?.isTop === 0 ? { $unset: { isTop: "" } } : { $set: params };
    await Article.updateOne({ _id }, paramsData);
    if (params.coverImage !== params.oldCoverImage) {
      // 删除前先查找是否有文章使用相同的封面图片
      const findArticle = await Article.findOne({ authorId: params.authorId, coverImage: params.oldCoverImage });
      if (findArticle) return;
      await deleteFile(params.oldCoverImage);
    }
  }

  // 删除文章
  async adminDeleteArticles({ articleId }) {
    return await Article.updateOne(
      { _id: articleId },
      {
        $set: {
          isDelete: true,
        },
      }
    );
  }

  // 获取文章列表同时返回文章总条数
  async adminGetArticleListWithTotal({ filterKey, pageNo, pageSize }) {
    const list = await Article.aggregate([
      { $match: filterKey },
      {
        $facet: {
          total: [{ $count: "count" }],
          data: [
            {
              $project: articleListRes,
            },
            { $sort: { isTop: -1, createTime: -1, likeCount: -1 } },
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
    }
    return {
      total: 0,
      list: [],
    };
  }

  // 获取文章列表
  async adminFindArticles({
    pageNo = 1,
    pageSize = 20,
    filter,
    tagName,
    authorIds,
  }) {
    let filterKey;
    if (tagName) {
      filterKey = {
        tag: tagName,
      };
    } else {
      // 不区分大小写
      const reg = (filter && new RegExp(filter, "i")) || "";
      filterKey = {
        $or: [
          { title: { $regex: reg } },
          { tag: { $regex: reg } },
          { classify: { $regex: reg } },
          { authorId: { $regex: reg } },
          { authorName: { $regex: reg } },
          { abstract: { $regex: reg } },
        ],
      };
    }

    // 如果有authorIds，说明不是超级管理员，需要根据绑定的前台账号拉取对应的文章列表
    if (authorIds?.length) {
      filterKey.authorId = { $in: authorIds };
    }

    return await new articleServer().adminGetArticleListWithTotal({
      filterKey,
      pageNo,
      pageSize,
    });
  }

  // 根据文章id查找文章详情
  async adminFindArticleById(id) {
    const article = await Article.findById(id, detailFields);
    const userInfo = article && (await findUserById(article.authorId));
    return {
      ...article._doc,
      authorName: userInfo?.username,
      headUrl: userInfo?.headUrl,
    };
  }

  // 获取文章总条数
  async adminGetArticleTotal(filter) {
    const res = Article.find(filter).count();
    return res;
  }

  // 批量删除文章
  async adminBatchDeleteArticle({ articleIds, classifys }) {
    const res = await Article.deleteMany({ _id: { $in: articleIds } });
    await adminUpdateClassify({
      classifyNames: classifys,
      articleIds: articleIds,
      isDelete: true,
    });
    return res.deletedCount;
  }

  // 下架文章
  async adminRemoveArticle({ articleIds }) {
    const res = await Article.updateMany(
      { _id: { $in: articleIds } },
      {
        $set: {
          isDelete: true,
        },
      }
    );
    return res;
  }

  // 重新上架文章
  async adminShelvesArticle({ articleIds }) {
    const res = await Article.updateMany(
      { _id: { $in: articleIds } },
      { $unset: { isDelete: true } }
    );
    return res;
  }

  // 根据文章id查找评论
  async adminFindCommentById(articleId) {
    const comment = await Comments.find({ articleId }).sort({ date: -1 });
    return comment;
  }

  // 删除评论
  async adminDeleteComment(commentId, fromCommentId, articleId) {
    const replyComment = await Comments.findOne(
      { articleId, "replyList._id": fromCommentId, "replyList.isDelete": true },
      { replyList: { $elemMatch: { isDelete: true } } }
    );

    const res = await Comments.findOne({
      _id: commentId,
      articleId,
      isDelete: { $nin: [true] },
    });

    const filter = fromCommentId
      ? {
        "replyList._id": fromCommentId, // 选择数组replyList中某个对象中的_id属性
      }
      : { _id: commentId };
    let count = 0;
    // fromCommentId有值说明是子级评论，直接减一就行
    if (fromCommentId) {
      count = replyComment ? 0 : 1;
    }

    // fromCommentId没有值说明是最上层父级评论，删除时需要加上底下所有子级的评论数及自身数量1，并且需要排除之前删除的replyList中的子级评论
    if (res && !fromCommentId) {
      const notDel = res.replyList.filter((i) => !i.isDelete);
      count = notDel.length + 1;
    }

    if (fromCommentId) {
      const delComment = await Comments.updateOne(
        {
          $and: [filter],
        },
        // $pull 可以删除replyList中id与fromCommentId匹配的数据
        { $pull: { replyList: { _id: fromCommentId } } }
      );
      return delComment;
    } else {
      const delComment = await Comments.deleteOne({
        $and: [filter],
      });
      return delComment;
    }
  }

  // 下架评论
  async adminRemoveComment(commentId, fromCommentId, articleId) {
    const filter = fromCommentId
      ? {
        "replyList._id": fromCommentId, // 选择数组replyList中某个对象中的_id属性
      }
      : { _id: commentId };

    let count = 0;

    // fromCommentId有值说明是子级评论，直接减一就行
    if (fromCommentId) {
      count = 1;
    }

    const res = await Comments.findOne({ _id: commentId, articleId });

    // fromCommentId没有值说明是最上层父级评论，删除时需要加上底下所有子级的评论数及自身数量1，并且需要排除之前删除的replyList中的子级评论
    if (res && !fromCommentId) {
      const notDel = res.replyList.filter((i) => !i.isDelete);
      // count = notDel.length + 1;
      count = 1;
    }

    const comment = await Comments.updateOne(
      {
        $and: [filter],
      },
      // $inc：自增自减运算符，传入正值为自增，负值为自减
      {
        $set: fromCommentId
          ? {
            "replyList.$.isDelete": true,
          }
          : {
            isDelete: true,
          },
      }
    );

    return comment;
  }

  // 恢复评论
  async adminRestoreComment(commentId, fromCommentId, articleId) {
    const filter = fromCommentId
      ? {
        "replyList._id": fromCommentId, // 选择数组replyList中某个对象中的_id属性
      }
      : { _id: commentId };

    let count = 0;

    // fromCommentId有值说明是子级评论，直接减一就行
    if (fromCommentId) {
      count = 1;
    }

    // fromCommentId没有值说明是最上层父级评论，删除时需要加上底下所有子级的评论数及自身数量1，并且需要排除之前删除的replyList中的子级评论
    if (!fromCommentId) {
      count = 1;
    }

    const comment = await Comments.updateOne(
      {
        $and: [filter],
      },
      // $inc：自增自减运算符，传入正值为自增，负值为自减
      {
        $unset: fromCommentId
          ? {
            "replyList.$.isDelete": true,
          }
          : {
            isDelete: true,
          },
      }
    );

    return comment;
  }

  // 后台评论管理评论列表
  async getArticleCommentList(articleIds) {
    const commentList = await Comments.aggregate([
      { $match: { articleId: { $in: articleIds } } },
      {
        $project: {
          id: "$_id",
          articleId: "$articleId",
          userId: 1,
          username: 1,
          avatarUrl: 1,
          date: 1,
          content: 1,
          fromUserId: 1,
          likeCount: 1,
          isLike: 1,
          isDelete: 1,
          headUrl: 1,
          replyList: 1,
        },
      },
      { $sort: { date: -1 } }, // 将排序放在这里
      {
        $group: {
          _id: "$articleId",
          count: { $sum: 1 },
          comments: {
            $push: {
              id: "$_id",
              articleId: "$articleId",
              userId: "$userId",
              username: "$username",
              avatarUrl: "$avatarUrl",
              date: "$date",
              content: "$content",
              fromUserId: "$fromUserId",
              likeCount: "$likeCount",
              isLike: "$isLike",
              isDelete: "$isDelete",
              headUrl: "$headUrl",
              replyList: "$replyList",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          articleId: "$_id",
          count: 1,
          comments: 1,
        },
      },
      { $sort: { date: -1 } },
    ]);

    return commentList;
  }

  // 获取文章评论列表
  async adminGetArticlesComments({ pageNo, pageSize, bindUsers = [] }) {
    const matchParams = bindUsers?.length
      ? {
        authorId: { $in: bindUsers },
      }
      : {};

    const list = await Article.aggregate([
      // {
      //   $lookup: {
      //     from: "comments",
      //     localField: "articleId",
      //     foreignField: "_id",
      //     as: "comments"
      //   }
      // },
      {
        $match: matchParams,
      },
      {
        $facet: {
          total: [{ $count: "count" }],
          data: [
            {
              $project: {
                _id: 0, // 默认情况下_id是包含的，将_id设置为0|false，则选择不包含_id，其他字段也可以这样选择是否显示。
                id: "$_id", // 将_id更名为classify
                title: 1,
                authorId: 1,
                isDelete: 1,
                createTime: 1,
              },
            },
            { $sort: { createTime: -1, likeCount: -1 } },
            { $skip: (pageNo - 1) * pageSize },
            { $limit: pageSize },
          ],
        },
      },
    ]);

    if (list?.length) {
      const { total, data } = list[0];

      const articleIds = data.map((i) => i.id.toString());

      const comments = await new articleServer().getArticleCommentList(
        articleIds
      );

      data.forEach((i) => {
        comments.forEach((j) => {
          if (j.articleId === i.id.toString()) {
            i.commentList = j;
          }
        });
      });

      return {
        total: total[0]?.count || 0,
        list: data || [],
      };
    }
    return {
      total: 0,
      list: [],
    };
  }
}

module.exports = new articleServer();
