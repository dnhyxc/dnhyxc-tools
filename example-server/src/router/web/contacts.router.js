const Router = require("koa-router");
const {
  addContactsCtr,
  deleteContactsCtr,
  onUpdateContactCtr,
  getContactListCtr,
  searchContactsCtr,
  onUpdateCatchContactCtr,
  mergeContactsCtr,
  getCatchContactListCtr,
  deleteCatchContactsCtr,
} = require("../../controller");

const { auth, countApiCalls } = require("../../middleware");

const router = new Router({ prefix: "/api" });

// 添加联系人
router.post("/addContacts", auth, countApiCalls, addContactsCtr);

// 更新联系人
router.post("/updateContact", auth, countApiCalls, onUpdateContactCtr);

// 更新缓存联系人
router.post("/onUpdateCatchContact", auth, countApiCalls, onUpdateCatchContactCtr);

// 合并联系人
router.post("/mergeContacts", auth, countApiCalls, mergeContactsCtr);

// 删除联系人
router.post("/deleteContacts", auth, countApiCalls, deleteContactsCtr);

// 获取联系人
router.post("/getContactList", auth, countApiCalls, getContactListCtr);

// 获取缓存联系人
router.post("/getCatchContactList", auth, countApiCalls, getCatchContactListCtr);

// 搜索联系人
router.post("/searchContacts", auth, countApiCalls, searchContactsCtr);

// 搜索缓存联系人
router.post("/deleteCatchContacts", auth, countApiCalls, deleteCatchContactsCtr);

module.exports = router;
