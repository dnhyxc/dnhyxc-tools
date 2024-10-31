// 操作数据库报错统一错误提示
const databaseError = {
  code: "10000",
  success: false,
  message: "Sorry for the inexplicable error",
  data: "",
};

// 检验用户失败
const verifyUserError = {
  code: "10000",
  success: false,
  message: "检验用户失败",
  data: "",
};

const userFormateError = {
  code: "10001",
  success: false,
  message: "用户名或密码不能为空",
  data: "",
};

const fieldFormateError = {
  code: "10001",
  success: false,
  message: "参数异常",
  data: "",
};

const userAlreadyExited = {
  code: "10002",
  success: false,
  message: "用户已存在",
  data: "",
};

const userRegisterError = {
  code: "10003",
  success: false,
  message: "用户注册错误",
  data: "",
};

const userLoginError = {
  code: "10004",
  success: false,
  message: "用户登录错误",
  data: "",
};

const userNotFind = {
  code: "10005",
  success: false,
  message: "用户不存在",
  data: "",
};

const userIsDelete = {
  code: "10015",
  success: false,
  message: "用户已被停用",
  data: "",
};

const userPhoneError = {
  code: "10006",
  success: false,
  message: "手机号不一致",
  data: "",
};

const userPwdError = {
  code: "10008",
  success: false,
  message: "密码错误",
  data: "",
};

const pwdNotChange = {
  code: "10007",
  success: false,
  message: "密码与原来一致",
  data: "",
};

const userNotExist = {
  code: "10009",
  success: false,
  message: "该用户已奔赴星辰大海，再难寻回",
  data: "",
};

const ArticleNotFind = {
  code: "10010",
  success: false,
  message: "文章不存在",
  data: "",
};

const TokenExpiredError = {
  code: "10101",
  success: false,
  message: "登录已过期，请重新登录",
  data: new Date().valueOf(),
};

const JsonWebTokenError = {
  code: "10102",
  success: false,
  message: "登录已失效，请重新登录后再试",
  data: new Date().valueOf(),
};

const DetailTokenExpiredError = {
  code: "10103",
  success: false,
  message: "登录已过期，请重新登录",
  data: new Date().valueOf(),
};

const fileUploadError = {
  code: "10201",
  success: false,
  message: "文件上传失败",
  data: "",
};

const fileNotFound = {
  code: "10202",
  success: false,
  message: "文件不存在",
  data: "",
};

const collectionAlreadyExited = {
  code: "10002",
  success: false,
  message: "收藏集已存在",
  data: "",
};

const anotherFields = {
  id: "$_id",
  _id: 0,
  title: 1,
  tag: 1,
  classify: 1,
  abstract: 1,
  createTime: 1,
  authorId: 1,
  authorName: 1,
  coverImage: 1,
  likeCount: 1,
  readCount: 1,
  gradient: 1,
};

const detailFields = {
  id: "$_id",
  _id: 0,
  title: 1,
  content: 1,
  classify: 1,
  tag: 1,
  abstract: 1,
  createTime: 1,
  coverImage: 1,
  authorId: 1,
  likeCount: 1,
  isLike: 1,
  authorName: 1,
  originalArticleId: 1,
  readCount: 1,
  isDelete: 1,
  collectCount: 1,
};

const deployFields = {
  id: "$_id",
  _id: 0,
  projectName: 1,
  userId: 1,
  projectLocalFilePath: 1, // 本地项目地址
  gitUrl: 1,
  projectRemoteFilePath: 1, // 远程项目地址
  projectRemoteDir: 1, // 远程项目地址
  isServer: 1, // 是否是服务端项目
  install: 1,
  createTime: 1,
};

const serverFields = {
  id: "$_id",
  _id: 0,
  userId: 1,
  serverHost: 1,
  serverPort: 1,
  serverUsername: 1,
  nginxRemoteFilePath: 1,
  nginxRestartPath: 1,
  serviceRemoveFilePath: 1,
  remoteLogFilePath: 1,
  remoteErrorLogFilePath: 1,
  serverKey: 1,
  createTime: 1,
};

const userFields = {
  username: 1,
  phone: 1,
  job: 1,
  motto: 1,
  headUrl: 1,
  introduce: 1,
  github: 1,
  juejin: 1,
  zhihu: 1,
  blog: 1,
  mainCover: 1,
  auth: 1,
  registerTime: 1,
  isDelete: 1,
  bindUserId: 1,
  bindUserIds: 1,
  menus: 1,
  updateTime: 1,
};

// 收藏集response
const collectionRes = {
  id: "$_id",
  _id: 0,
  name: 1,
  status: 1,
  count: 1,
  desc: 1,
  createTime: 1,
  articleIds: 1,
  userId: 1,
  collectUserIds: 1,
};

// 文章列表返回字段
const articleListRes = {
  _id: 0, // 默认情况下_id是包含的，将_id设置为0|false，则选择不包含_id，其他字段也可以这样选择是否显示。
  id: "$_id", // 将_id更名为classify
  title: 1,
  classify: 1,
  tag: 1,
  coverImage: 1,
  abstract: 1,
  authorId: 1,
  isLike: 1,
  likeCount: 1,
  createTime: 1,
  authorName: 1,
  readCount: 1,
  isDelete: 1,
  isTop: 1,
  gradient: 1,
};

// 联系人返回字段
const contactsRes = {
  userId: 1,
  contactId: 1,
  createTime: 1,
  noReadCount: 1,
  isTop: 1,
  isUnDisturb: 1,
};

module.exports = {
  databaseError,
  verifyUserError,
  userFormateError,
  userAlreadyExited,
  userRegisterError,
  userLoginError,
  userPwdError,
  userIsDelete,
  userPhoneError,
  userNotFind,
  ArticleNotFind,
  pwdNotChange,
  TokenExpiredError,
  JsonWebTokenError,
  DetailTokenExpiredError,
  fileUploadError,
  fieldFormateError,
  userNotExist,
  anotherFields,
  detailFields,
  userFields,
  collectionAlreadyExited,
  collectionRes,
  fileNotFound,
  articleListRes,
  contactsRes,
  deployFields,
  serverFields,
};
