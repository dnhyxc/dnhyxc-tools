const axios = require('axios')
const { databaseError } = require("../../constant");
const {
  adminAddTools,
  adminGetToolListWithTotal,
  adminUpdateTools,
  adminDeleteTools,
  adminCreateToolSort,
  adminGetToolSort,
  adminUpdateToolSort,
} = require("../../service");

class ToolsController {
  // 添加工具
  async adminAddToolsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await adminAddTools(params);
      ctx.body = {
        code: 200,
        message: "添加工具成功",
        success: true,
        data: res.id,
      };
    } catch (error) {
      console.error("adminAddToolsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取工具列表
  async adminGetToolListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const sortRes = await adminGetToolSort({ userId: params.userId });
      if (sortRes) {
        await adminUpdateTools({
          sortInfo: sortRes.sortInfo,
        });
      }
      const res = await adminGetToolListWithTotal({
        ...params,
        sortByTime: sortRes ? false : true,
      });
      ctx.body = {
        code: 200,
        message: "获取工具列表成功",
        success: true,
        data: res,
      };
    } catch (error) {
      console.error("adminGetToolListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 更新工具
  async adminUpdateToolsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await adminUpdateTools(params);
      ctx.body = {
        code: 200,
        message: "更新成功",
        success: true,
        data: res,
      };
    } catch (error) {
      console.error("adminUpdateToolsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 删除工具
  async adminDeleteToolsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await adminDeleteTools(params);
      ctx.body = {
        code: 200,
        message: "删除成功",
        success: true,
        data: res,
      };
    } catch (error) {
      console.error("adminDeleteToolsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 创建工具排序
  async adminCreateToolSortCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      await adminCreateToolSort(params);
      ctx.body = {
        code: 200,
        message: "设置成功",
        success: true,
        data: params?.sortInfo?.length,
      };
    } catch (error) {
      console.error("adminCreateToolSortCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 更新工具排序
  async adminUpdateToolSortCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await adminUpdateToolSort(params);
      ctx.body = {
        code: 200,
        message: "更新成功",
        success: true,
        data: res,
      };
    } catch (error) {
      console.error("adminUpdateToolSortCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 创建工具排序
  async adminGetToolSortCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await adminGetToolSort(params);
      ctx.body = {
        code: 200,
        message: "获取成功",
        success: true,
        data: res,
      };
    } catch (error) {
      console.error("adminGetToolSortCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 根据url获取网页信息
  async adminGetPageInfoCtr(ctx, next) {
    try {
      const { url } = ctx.request.body;
      const response = await axios.get(url);
      const html = response.data;
      ctx.body = {
        code: 200,
        message: "获取成功",
        success: true,
        data: html,
      };
    } catch (error) {
      ctx.app.emit("error", {
        code: '10000',
        success: false,
        message: '链接无效'
      }, ctx);
    }
  }
}

module.exports = new ToolsController();
