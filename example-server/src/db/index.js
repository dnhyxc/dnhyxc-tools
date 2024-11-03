const mongoose = require('mongoose');

const connectMongodb = () => {
  mongoose.set('strictQuery', false); // 或 true，用于控制在查询时如何处理不匹配的字段。

  mongoose
    .connect('mongodb://127.0.0.1:27017/dnhyxc')
    .then(() => {
      console.log('mongoose connect success');
    })
    .catch((err) => {
      console.log('mongoose connect error', err);
    });
};

module.exports = connectMongodb;
