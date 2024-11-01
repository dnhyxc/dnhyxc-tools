// 操作数据库报错统一错误提示
const databaseError = {
  code: '10000',
  success: false,
  message: 'Sorry for the inexplicable error',
  data: '',
};

// 检验用户失败
const verifyUserError = {
  code: '10000',
  success: false,
  message: '检验用户失败',
  data: '',
};

const userFormateError = {
  code: '10001',
  success: false,
  message: '用户名或密码不能为空',
  data: '',
};

const fieldFormateError = {
  code: '10001',
  success: false,
  message: '参数异常',
  data: '',
};

const userAlreadyExited = {
  code: '10002',
  success: false,
  message: '用户已存在',
  data: '',
};

const userRegisterError = {
  code: '10003',
  success: false,
  message: '用户注册错误',
  data: '',
};

const userLoginError = {
  code: '10004',
  success: false,
  message: '用户登录错误',
  data: '',
};

const userNotFind = {
  code: '10005',
  success: false,
  message: '用户不存在',
  data: '',
};

const userIsDelete = {
  code: '10015',
  success: false,
  message: '用户已被停用',
  data: '',
};

const userPhoneError = {
  code: '10006',
  success: false,
  message: '手机号不一致',
  data: '',
};

const userPwdError = {
  code: '10008',
  success: false,
  message: '密码错误',
  data: '',
};

const pwdNotChange = {
  code: '10007',
  success: false,
  message: '密码与原来一致',
  data: '',
};

const userNotExist = {
  code: '10009',
  success: false,
  message: '该用户已奔赴星辰大海，再难寻回',
  data: '',
};

const ArticleNotFind = {
  code: '10010',
  success: false,
  message: '文章不存在',
  data: '',
};

const TokenExpiredError = {
  code: '10101',
  success: false,
  message: '登录已过期，请重新登录',
  data: new Date().valueOf(),
};

const JsonWebTokenError = {
  code: '10102',
  success: false,
  message: '登录已失效，请重新登录后再试',
  data: new Date().valueOf(),
};

const DetailTokenExpiredError = {
  code: '10103',
  success: false,
  message: '登录已过期，请重新登录',
  data: new Date().valueOf(),
};

const fileUploadError = {
  code: '10201',
  success: false,
  message: '文件上传失败',
  data: '',
};

const fileNotFound = {
  code: '10202',
  success: false,
  message: '文件不存在',
  data: '',
};

const collectionAlreadyExited = {
  code: '10002',
  success: false,
  message: '收藏集已存在',
  data: '',
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
  collectionAlreadyExited,
  fileNotFound,
};
