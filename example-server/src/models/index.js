// 前台model
const User = require("./web/user.model");
const Article = require("./web/article.model");
const Draft = require("./web/draft.model");
const Comments = require("./web/comments.model");
const Like = require("./web/like.model");
const LikeArticle = require("./web/likeArticle.model");
const Collection = require("./web/collection.model");
const Message = require("./web/message.model");
const Interact = require("./web/interact.model");
const Follow = require("./web/follow.model");
const Atlas = require("./web/atlas.model");
const Books = require("./web/book.model");
const BookRecords = require("./web/bookRecords.model");
const Convert = require("./web/convert.model");
const { Codes, CodeFolders } = require("./web/code.model");
const { Chat, CacheChats, NewChats } = require("./web/chat.model");
const { Contacts, CatchContacts } = require("./web/contacts.model");
const VerifyCodes = require("./web/verifyCode.model");
const { Deploy, DeployServer } = require("./web/deploy.model");
const NginxConfig = require("./web/nginxConfig.model");
const Resume = require("./web/resume.model");

// 后台model
const AdminUsers = require("./admin/user.model");
const PageConfig = require("./admin/config.model");
const Classify = require("./admin/classify.model");
const Tools = require("./admin/tools.model");
const ToolSort = require("./admin/toolSort.model");
const Themes = require("./admin/theme.model");
const Menus = require("./admin/menu.model");
const AdminVerifyCodes = require("./admin/verifyCode.model");
const { ApiCalledCounts, ApiCalls, ApiCalled, ApiCalledDaily } = require("./admin/apiCalls.model");

module.exports = {
  User,
  VerifyCodes,
  Article,
  Draft,
  Comments,
  Like,
  LikeArticle,
  AdminUsers,
  Collection,
  Message,
  Interact,
  Follow,
  Atlas,
  Books,
  BookRecords,
  Convert,
  Codes,
  CodeFolders,
  Chat,
  Deploy,
  DeployServer,
  NginxConfig,
  Resume,
  CacheChats,
  NewChats,
  Contacts,
  CatchContacts,
  PageConfig,
  Classify,
  Tools,
  ToolSort,
  Themes,
  Menus,
  AdminVerifyCodes,
  ApiCalls,
  ApiCalled,
  ApiCalledDaily,
  ApiCalledCounts,
};
