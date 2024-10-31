const {
  createDraft,
  updateDraft,
  deleteDraft,
  findDraftList,
  findDraftById,
} = require("../../service");
const {
  databaseError,
  ArticleNotFind,
  fieldFormateError,
} = require("../../constant");

class DraftController {
  // 创建文章
  async createDraftCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      // 操作数据库
      const res = await createDraft({ ...params });

      const data = {
        id: res._id,
        authorId: res.authorId,
        authorName: res.authorName,
        content: res.content,
        createTime: res.createTime,
      };

      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "保存草稿成功",
        data,
      };
    } catch (error) {
      console.error("createDraftCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 更新文章
  async updateDraftCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      // 操作数据库
      await updateDraft({ ...params });
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "草稿更新成功",
        data: {
          id: params.articleId,
        },
      };
    } catch (error) {
      console.error("updateDraftCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 删除文章
  async deleteDraftCtr(ctx, next) {
    try {
      const { id } = ctx.request.body;
      if (!id) {
        ctx.app.emit("error", fieldFormateError, ctx);
        return;
      }
      // 操作数据库
      const res = await deleteDraft(id);
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "删除成功",
        data: id,
      };
    } catch (error) {
      console.error("deleteDraftCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取草稿列表
  async getDraftListCtr(ctx, next) {
    try {
      const { pageNo, pageSize, userId } = ctx.request.body;
      // 操作数据库
      const res = await findDraftList({
        pageNo,
        pageSize,
        userId,
      });
      // 返回结果
      if (res) {
        ctx.body = {
          code: 200,
          success: true,
          message: "获取文章列表成功",
          data: res,
        };
      }
    } catch (error) {
      console.error("getDraftListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 根据文章id草稿详情
  async getDraftByIdCtr(ctx, next) {
    try {
      const { id } = ctx.request.body;
      const res = await findDraftById(id);
      if (!res) {
        ctx.app.emit("error", ArticleNotFind, ctx);
        return;
      }
      if (res) {
        ctx.body = {
          code: 200,
          success: true,
          message: "获取草稿详情成功",
          data: res,
        };
      }
    } catch (error) {
      console.error("getDraftByIdCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new DraftController();
