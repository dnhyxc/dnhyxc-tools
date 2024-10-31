const { findOneCollection, adminApiCalled } = require("../service");
const {
  databaseError,
  collectionAlreadyExited,
  fieldFormateError,
} = require("../constant");

// 校验收藏集是否存在
const verifyCollection = async (ctx, next) => {
  const { name } = ctx.request.body;

  if (!name) {
    ctx.app.emit("error", fieldFormateError, ctx);
    return;
  }

  try {
    if (await findOneCollection({ name })) {
      return ctx.app.emit("error", collectionAlreadyExited, ctx);
    }
  } catch (error) {
    ctx.app.emit("error", databaseError, ctx);
  }

  await next();
};


// 中间件：统计接口调用量
const countApiCalls = async (ctx, next) => {
  const path = ctx.path;
  const params = ctx.request.body;
  try {
    // await adminApiCalls({ api: path, userId: params?.userId || '20091206' });
    await adminApiCalled({ api: path, userId: params?.userId });
  } catch (error) {
    console.error('保存API调用统计失败:', error);
  }
  await next();
};

module.exports = { verifyCollection, countApiCalls };
