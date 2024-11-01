const mongoose = require('mongoose');

const connectMongodb = () => {
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
