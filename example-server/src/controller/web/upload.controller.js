const path = require("path");
const fs = require("fs");
const {
  fileUploadError,
  fileNotFound,
  fieldFormateError,
} = require("../../constant");
const publicPath = path.join(__dirname, "../../upload/image");
const atlasPublicPath = path.join(__dirname, "../../upload/atlas");
const filesPublicPath = path.join(__dirname, "../../upload/files");

class UploadController {
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
      const host = process.env.NODE_ENV === 'development' ? ctx.host : 'dnhyxc.cn';
      ctx.body = {
        code: 200,
        message: "文件上传成功",
        success: true,
        data: {
          filePath: `${ctx.protocol}://${host}/${dirName()}/${basename}`,
          // filePath: `${ctx.origin}/${dirName()}/${basename}`,
        },
      };
    } else {
      ctx.app.emit("error", fileUploadError, ctx);
    }
  }

  /**
   * 参数说明： filePath 为要删除的文件路径
   */
  async removeFileCtr(ctx, next) {
    const { url } = ctx.request.body;

    const urls = url && Array.isArray(url) ? url : [url];

    urls.forEach((url) => {
      const isAtlas = url.includes("__ATLAS__");
      const isFile = url.includes("__FILE__");

      const dirName = () => {
        if (isAtlas) {
          return atlasPublicPath;
        } else if (isFile) {
          return filesPublicPath;
        } else {
          return publicPath;
        }
      };

      const index = url.lastIndexOf("/");
      const sliceUrl = url.substring(index + 1, url.length);
      const filePath = path.normalize(`${dirName()}/${sliceUrl}`);
      try {
        // 判断文件是否存在
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          // 判断是否是文件
          if (stats?.isFile()) {
            // 删除文件
            fs.unlinkSync(filePath);
          }
          ctx.body = {
            code: 200,
            message: "文件删除成功",
            success: true,
          };
        } else {
          ctx.app.emit("error", fileNotFound, ctx);
        }
      } catch (error) {
        ctx.app.emit("error", fileNotFound, ctx);
      }
    });
  }

  // 删除图片
  async removeAtlasImage(url) {
    const urls = url && Array.isArray(url) ? url : [url];
    urls.forEach((url) => {
      const dirName = url.includes("__ATLAS__") ? atlasPublicPath : publicPath;
      const index = url.lastIndexOf("/");
      const sliceUrl = url.substring(index + 1, url.length);
      const filePath = path.normalize(`${dirName}/${sliceUrl}`);
      try {
        // 判断文件是否存在
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          // 判断是否是文件
          if (stats?.isFile()) {
            // 删除文件
            fs.unlinkSync(filePath);
          }
        }
      } catch (error) {
        throw new Error("删除失败");
      }
    });
  }

  // 批量删除图片资源
  async deleteFiles(urls) {
    urls.forEach((url) => {
      const isAtlas = url.includes("__ATLAS__");
      const isFile = url.includes("__FILE__");
      const dirName = () => {
        if (isAtlas) {
          return atlasPublicPath;
        } else if (isFile) {
          return filesPublicPath;
        } else {
          return publicPath;
        }
      };
      const index = url.lastIndexOf("/");
      const sliceUrl = url.substring(index + 1, url.length);
      const filePath = path.normalize(`${dirName()}/${sliceUrl}`);
      try {
        // 判断文件是否存在
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          // 判断是否是文件
          if (stats?.isFile()) {
            // 删除文件
            fs.unlinkSync(filePath);
          }
        }
      } catch (error) {
        throw new Error("删除失败");
      }
    });
  }

  // 删除文件
  async deleteFile(url) {
    if (!url) return;

    const isAtlas = url.includes("__ATLAS__");
    const isFile = url.includes("__FILE__");

    const dirName = () => {
      if (isAtlas) {
        return atlasPublicPath;
      } else if (isFile) {
        return filesPublicPath;
      } else {
        return publicPath;
      }
    };

    const index = url.lastIndexOf("/");
    const sliceUrl = url.substring(index + 1, url.length);
    const filePath = path.normalize(`${dirName()}/${sliceUrl}`);
    try {
      // 判断文件是否存在
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        // 判断是否是文件
        if (stats?.isFile()) {
          // 删除文件
          fs.unlinkSync(filePath);
        }
      }
    } catch (error) {
      throw new Error("删除失败");
    }
  }

  // 文件下载
  async downLoadFileCtr(ctx, next) {
    const { system } = ctx.request.body;
    if (!system) {
      ctx.app.emit("error", fieldFormateError, ctx);
      return;
    }
    const file = system !== "mac" ? "dnhyxc.zip" : "dnhyxc-mac.zip";
    const host = process.env.NODE_ENV === 'development' ? ctx.host : 'dnhyxc.cn';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    ctx.body = {
      code: 200,
      message: "获取文件成功",
      success: true,
      data: {
        filePath: `${protocol}://${host}/files/${file}`,
        // filePath: `${ctx.origin}/files/${file}`,
      },
    };
  }
}

module.exports = new UploadController();
