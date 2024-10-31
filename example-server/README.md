### 采用的技术框架

后台采用 `koa2` 编写，数据则采用 `mongoodb`。

### 文件上传返回路径域名过期后得修改

upload.controller.js:

```js
// 文件上传
  async uploadFileCtr(ctx, next) {
    const { file } = ctx.request.files;
    const isAtlas = file.originalFilename.includes("__ATLAS__");
    const isFile = file.originalFilename.includes("__FILE__");

    const dirName = () => {
      if (isAtlas) {
        return "atlas";
      } else if (isFile) {
        return "files";
      } else {
        return "image";
      }
    };

    if (file) {
      const basename = path.basename(file.filepath);
      ctx.body = {
        code: 200,
        message: "文件上传成功",
        success: true,
        data: {
          // 这个地方得修改，域名过期的时候
          filePath: `${ctx.protocol}s://dnhyxc.cn/${dirName()}/${basename}`,
          // filePath: `${ctx.origin}/${dirName()}/${basename}`,
        },
      };
    } else {
      ctx.app.emit("error", fileUploadError, ctx);
    }
  }
```
