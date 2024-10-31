const {
  addBook,
  findBook,
  getBooksWithTotal,
  updateBookInfo,
  findBookUrl,
  deleteBook,
} = require("../../service");
const { deleteFile } = require("./upload.controller");
const { databaseError } = require("../../constant");

class booksController {
  // 添加书籍
  async addBookCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const findOne = await findBook(params);
      if (findOne) {
        ctx.body = {
          code: 201,
          success: true,
          message: "该书籍已存在",
          data: findOne,
        };
      } else {
        const res = await addBook(params);
        ctx.body = {
          code: 200,
          success: true,
          message: "添加成功",
          data: res,
        };
      }
    } catch (error) {
      console.error("addBookCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 更新书籍信息
  async updateBookInfoCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      // 如果传了params.coverImg 这个需要删除之前的封面
      // 查找对应的书籍url
      const book = await findBookUrl(params);
      if (params?.coverImg && book?.coverImg && params?.coverImg !== book?.coverImg) {
        await deleteFile(book?.coverImg);
      }
      await updateBookInfo(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "更新成功",
        data: params,
      };
    } catch (error) {
      console.error("updateBookCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 查找书籍信息
  async findBookCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await findBook(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取成功",
        data: res,
      };
    } catch (error) {
      console.error("findBookCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取书籍列表
  async getBookListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getBooksWithTotal(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取书籍列表成功",
        data: res,
      };
    } catch (error) {
      console.error("getBookListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 删除书籍
  async deleteBookCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      // 查找对应的书籍url
      const book = await findBookUrl(params);
      const res = await deleteBook(params);
      await deleteFile(book?.url);
      await deleteFile(book?.coverImg);
      ctx.body = {
        code: 200,
        success: true,
        message: "删除成功",
        data: res,
      };
    } catch (error) {
      console.error("deleteBookCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new booksController();
