const { Books } = require("../../models");

class BooksServer {
  // 添加书
  async addBook({ userId, url, fileName, size, type, category }) {
    const res = await Books.create({
      userId,
      url,
      createTime: new Date().valueOf(),
      fileName,
      size,
      type,
      category,
    });

    return {
      userId: res.userId,
      createTime: res.createTime,
      url: res.url,
      id: res._id,
      fileName: res.fileName,
      size: res.size,
      type: res.type,
      category: res.category,
    };
  }

  async findBook({ url, userId }) {
    const params = userId ? { userId, url } : { url };
    const res = await Books.findOne(params, {
      id: "$_id",
      _id: 0,
      createTime: 1,
      url: 1,
      userId: 1,
      type: 1,
      fileName: 1,
      size: 1,
    });

    return res;
  }

  // 更新书信息
  async updateBookInfo({
    id,
    fileName,
    coverImg,
    author,
    translator,
    language,
    category,
  }) {
    const res = await Books.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          fileName,
          coverImg,
          author,
          translator,
          language,
          category,
        },
      }
    );
    return res.modifiedCount;
  }

  // 获取书集列表
  async getBooksWithTotal({ pageNo, pageSize, userId, bookType = "epub", category }) {
    const TYPES = {
      pdf: /pdf/,
      epub: /epub|epub\.zip/,
      word: /word/,
    };
    const list = await Books.aggregate([
      { $match: category === "all" ? { type: TYPES[bookType] } : { type: TYPES[bookType], category } },
      {
        $facet: {
          total: [{ $count: "count" }],
          data: [
            {
              $project: {
                id: "$_id",
                _id: 0,
                userId: 1,
                url: 1,
                createTime: 1,
                isDelete: 1,
                fileName: 1,
                coverImg: 1,
                author: 1,
                translator: 1,
                language: 1,
                size: 1,
                type: 1,
                category: 1,
              },
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

  // 查找书籍url
  async findBookUrl({ id }) {
    const res = await Books.findOne({ _id: id }, { url: 1, coverImg: 1 });
    return res;
  }

  // 删除书籍
  async deleteBook({ id }) {
    const res = await Books.deleteOne({ _id: id });
    return res.deletedCount;
  }
}

module.exports = new BooksServer();
