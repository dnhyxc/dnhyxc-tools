const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { VM } = require("vm2");
const { databaseError } = require("../../constant");
const {
  addCode,
  updateCode,
  deleteCode,
  getCodeListWithTotal,
  getCodeById,
  addCodeFolders,
  updateCodeFolders,
  getCodeFoldersById,
  deleteCodeFolders,
  getCodeFoldersWithTotal,
} = require("../../service");

class codesController {
  // 添加代码示例
  async addCodeCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await addCode(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "保存成功",
        data: res,
      };
    } catch (error) {
      console.error("addCodeCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 更新代码示例
  async updateCodeCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      await updateCode(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "更新成功",
        data: {
          id: params.id,
        },
      };
    } catch (error) {
      console.error("updateCodeCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async getCodeListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getCodeListWithTotal(params);
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取代码示例列表成功",
        data: res,
      };
    } catch (error) {
      console.error("getCodeListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async getCodeByIdCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getCodeById(params);
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取成功",
        data: res,
      };
    } catch (error) {
      console.error("getCodeByIdCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async deleteCodeCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await deleteCode(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "删除成功",
        data: res,
      };
    } catch (error) {
      console.error("deleteCodeCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 编译 C 语言
  async compileCCodeCtr(ctx, next) {
    const { code, option = "-lm" } = ctx.request.body;

    const getResult = (success, message, data) => {
      return {
        code: 200,
        success,
        message,
        data,
      };
    };

    const runCode = ({ filePath, compiled }) => {
      // 调用系统命令编译代码
      return new Promise((resolve, reject) => {
        exec(
          `gcc ${filePath} -o ${compiled} ${option} && ${compiled}`,
          (error, stdout, stderr) => {
            if (error) {
              resolve(getResult(false, "执行错误", stderr));
              return;
            }
            // 编译出错
            if (stderr) {
              resolve(getResult(false, "编译错误", stderr));
              return;
            }
            resolve(getResult(true, "执行成功", stdout));
          }
        );
      });
    };

    try {
      // 保存需要运行代码文件的文件夹
      const folderPath = path.join(__dirname, "../../compile");
      // 编译前的文件路径
      const filePath = path.join(folderPath, "compile.c");
      // 编译后的文件路径
      const compiled = `${folderPath}/compiled`;

      // 检查文件夹是否存在
      if (!fs.existsSync(folderPath)) {
        // 如果文件夹不存在，则创建文件夹
        fs.mkdirSync(folderPath);
        // 写入代码到 compile.c 文件中
        fs.writeFileSync(filePath, code);
      } else {
        fs.writeFileSync(filePath, code);
      }

      const res = await runCode({ filePath, compiled });

      ctx.body = res;

      // 运行完成之后，检查目录是否存在，存在则删除
      if (fs.existsSync(folderPath)) {
        // 删除目录及其下所有文件和子目录
        fs.rmdirSync(folderPath, { recursive: true });
      }
    } catch (error) {
      console.error("compileCCodeCtr", error);
      ctx.app.emit(
        "error",
        {
          code: "10000",
          success: false,
          message: "程序执行出错",
        },
        ctx
      );
    }
  }

  // 编译 JS
  async compileJSCodeCtr(ctx, next) {
    const { code } = ctx.request.body;

    let logs = null;

    const codeRun = () => {
      const vm = new VM({
        compiler: "javascript",
        sandbox: {
          name: "dnhyxc",
          console: {
            log: (args) => {
              logs = args;
            },
            info: (...args) => {
              logs = args;
            },
            warn: (...args) => {
              logs = args;
            },
            error: (...args) => {
              logs = args;
            },
            table: (...args) => {
              logs = args;
            },
            time: (...args) => {
              logs = args;
            },
            timeEnd: (...args) => {
              logs = args;
            },
            debug: (...args) => {
              logs = args;
            },
          },
        },
      });
      const result = vm.run(code);
      return result;
    };

    try {
      const result = codeRun();
      ctx.body = {
        code: 200,
        success: true,
        message: "执行成功",
        data: JSON.stringify(result) || JSON.stringify(logs),
      };
    } catch (error) {
      ctx.body = {
        code: 200,
        success: true,
        message: "执行出错",
        data: error.message,
      };
    }
  }

  async addCodeFoldersCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await addCodeFolders(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "保存成功",
        data: res,
      };
    } catch (error) {
      console.error("addCodeFoldersCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async updateCodeFoldersCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      await updateCodeFolders(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "更新成功",
        data: {
          id: params.id,
        },
      };
    } catch (error) {
      console.error("updateCodeFoldersCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async getCodeFoldersWithTotalCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getCodeFoldersWithTotal(params);
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取文件目录列表成功",
        data: res,
      };
    } catch (error) {
      console.error("getCodeFoldersWithTotalCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async getCodeFoldersByIdCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getCodeFoldersById(params);
      // 返回结果
      ctx.body = {
        code: 200,
        success: true,
        message: "获取成功",
        data: res,
      };
    } catch (error) {
      console.error("getCodeFoldersByIdCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  async deleteCodeFoldersCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await deleteCodeFolders(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "删除成功",
        data: res,
      };
    } catch (error) {
      console.error("deleteCodeFoldersCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new codesController();
