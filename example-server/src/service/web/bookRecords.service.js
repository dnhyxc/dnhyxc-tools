const { BookRecords } = require("../../models");

class BookRecordsServer {
  // 添加阅读记录
  async createReadBookRecords({
    userId,
    bookId,
    tocHref,
    tocName,
    tocId,
    position,
  }) {
    const findOne = await new BookRecordsServer().getReadBookRecords({
      userId,
      bookId,
    });
    if (findOne) {
      const res = await BookRecords.updateOne(
        { bookId, userId },
        {
          $set: {
            tocHref,
            tocId,
            tocName,
            position,
          },
        }
      );
      return res.modifiedCount;
    } else {
      const res = await BookRecords.create({
        createTime: new Date().valueOf(),
        userId,
        bookId,
        tocName,
        tocHref,
        tocId,
        position,
      });
      return res;
    }
  }

  // 获取读书记录
  async getReadBookRecords({ userId, bookId }) {
    const res = await BookRecords.findOne(
      { userId, bookId },
      {
        id: "$_id",
        _id: 0,
        bookId: 1,
        tocHref: 1,
        tocId: 1,
        tocName: 1,
        userId: 1,
        createTime: 1,
        position: 1,
      }
    );
    return res;
  }

  // 删除阅读记录
  async deleteReadBookRecords({ userId, bookId }) {
    const res = await BookRecords.deleteOne({ userId, bookId });
    return res.deletedCount;
  }
}

module.exports = new BookRecordsServer();
