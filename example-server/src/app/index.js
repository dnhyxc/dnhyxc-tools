const path = require('path');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const router = require('../router/web');
const routerAdmin = require('../router/admin');
const connectMongodb = require('../db');
const { errorHandler } = require('../utils');

// 链接数据库
connectMongodb();

const app = new Koa();

// 注册解析参数的中间件
app.use(
  koaBody({
    // 支持多文件上传
    multipart: true,
    patchKoa: true,
    formidable: {
      // 图片保存的静态资源文件路径
      uploadDir: path.join(__dirname, '../upload'),
      // 是否保留扩展名
      keepExtensions: true,
      // 文件上传大小
      maxFieldsSize: 20 * 1024 * 1024,
      onFileBegin: (name, file) => {
        const isAtlas = file.originalFilename.includes('__ATLAS__');
        const isFile = file.originalFilename.includes('__FILE__');
        // 修改 filepath 使用前端生成文件唯一 filename 覆盖 koa-body 自动生成的 filename 属性
        const filePath = () => {
          if (isAtlas) {
            return '../upload/atlas';
          } else if (isFile) {
            return '../upload/files';
          } else {
            return '../upload/image';
          }
        };

        file.filepath = path.normalize(
          `${path.join(__dirname, filePath())}/${file.originalFilename}`
        );
      },
    },
  })
);

app.use(koaStatic(path.join(__dirname, '../upload')));

// 前台路由注册
app.use(router.routes()).use(router.allowedMethods());

// 后台路由注册
app.use(routerAdmin.routes()).use(routerAdmin.allowedMethods());

app.on('error', errorHandler);

module.exports = app;
