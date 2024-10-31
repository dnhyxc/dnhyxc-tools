const { Like } = require("../../models");

class likeServer {
  // 创建评论
  async createLike(commentId, userId) {
    // 查找
    const find = await Like.findOne({
      userId: userId,
      likeCommentId: commentId,
    });

    // 如果find有值说明点赞过，需要删除，否则就是没点过赞，需要创建，同时点赞数要加一
    if (find) {
      // 创建
      await Like.deleteOne({
        userId: userId,
        likeCommentId: commentId,
      });
      return true;
    } else {
      // 创建
      await Like.create({
        userId: userId,
        likeCommentId: commentId,
      });
      return false;
    }
  }
}

module.exports = new likeServer();
