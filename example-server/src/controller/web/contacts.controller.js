const {
  addContacts,
  deleteContacts,
  onUpdateContact,
  getContactList,
  searchContacts,
  onUpdateCatchContact,
  mergeContacts,
  getCatchContactList,
  deleteCatchContacts,
} = require("../../service");
const { databaseError } = require("../../constant");

class contactsController {
  // 添加联系人
  async addContactsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await addContacts(params);
      ctx.body = {
        code: 200,
        success: true,
        message: res ? "添加成功" : "重复添加",
        data: params.userId,
      };
    } catch (error) {
      console.error("addContactsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 删除联系人
  async deleteContactsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      await deleteContacts(params);
      ctx.body = {
        code: 200,
        message: "删除成功",
        success: true,
        data: params.userId,
      };
    } catch (error) {
      console.error("deleteContactsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 删除缓存联系人
  async deleteCatchContactsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      await deleteCatchContacts(params);
      ctx.body = {
        code: 200,
        message: "删除成功",
        success: true,
        data: params.userId,
      };
    } catch (error) {
      console.error("deleteCatchContactsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 联系人置顶/免打扰
  async onUpdateContactCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await onUpdateContact(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "更新成功",
        data: {
          count: res,
          contactId: params.contactId,
        },
      };
    } catch (error) {
      console.error("onUpdateContactCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 缓存联系人置顶/免打扰
  async onUpdateCatchContactCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await onUpdateCatchContact(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "更新成功",
        data: {
          count: res.modifiedCount,
          contactId: params.contactId,
        },
      };
    } catch (error) {
      console.error("onUpdateCatchContactCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 合并联系人
  async mergeContactsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await mergeContacts(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "合并成功",
        data: res,
      };
    } catch (error) {
      console.error("mergeContactsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取联系人
  async getContactListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getContactList(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取成功",
        data: res,
      };
    } catch (error) {
      console.error("getContactListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 获取缓存联系人
  async getCatchContactListCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await getCatchContactList(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取成功",
        data: res,
      };
    } catch (error) {
      console.error("getCatchContactListCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }

  // 搜索联系人
  async searchContactsCtr(ctx, next) {
    try {
      const params = ctx.request.body;
      const res = await searchContacts(params);
      ctx.body = {
        code: 200,
        success: true,
        message: "获取成功",
        data: res,
      };
    } catch (error) {
      console.error("searchContactsCtr", error);
      ctx.app.emit("error", databaseError, ctx);
    }
  }
}

module.exports = new contactsController();
