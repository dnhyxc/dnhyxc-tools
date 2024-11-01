const path = require('path');
const fs = require('fs');
const CryptoJS = require('crypto-js');
const md5 = require('js-md5');

const key = CryptoJS.enc.Utf8.parse(md5(Math.random().toString(36).substring(2, 17))); // 随机值作为密钥
const iv = CryptoJS.enc.Utf8.parse(md5(Math.random().toString(36).substring(2, 17))); // 随机值作为密钥偏移量

// 加密方法
const encryptCode = (code) => {
  const srcs = CryptoJS.enc.Utf8.parse(code);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString().toUpperCase();
};

// 解密方法
const decryptCode = (code) => {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(code);
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
};

const encryptRichText = (richText) => {
  // 先 encodeURIComponent 防止丢失特殊字符
  const encodedText = encodeURIComponent(richText);
  const encryptedBytes = CryptoJS.AES.encrypt(encodedText, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const encryptedText = encryptedBytes.toString();
  return encryptedText;
};

const decryptRichText = (encryptedText) => {
  try {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedText, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedEncodedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    // 因为加密前encodeURIComponent了，所以这里需要decodeURIComponent
    return decodeURIComponent(decryptedEncodedText);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

const errorHandler = (err, ctx) => {
  const statusMap = {
    '10001': 200,
    '10002': 200,
    '10003': 200,
    '10004': 200,
    '10005': 200,
    '10006': 409,
    '10009': 406,
    '10008': 200,
    '10101': 401,
    '10102': 409,
  };
  let status = statusMap[err.code] || 500;
  ctx.status = status;
  ctx.body = err;
};

// 解析 ws query 参数
const parseQuery = (url) => {
  const lastIndex = url.lastIndexOf('?');

  if (lastIndex > -1) {
    const search = url.substring(lastIndex + 1, url.length);
    const pairs = search ? search.split('&') : [];
    const query = {};
    for (let i = 0; i < pairs.length; ++i) {
      const [key, value] = pairs[i].split('=');
      query[key] = value;
    }
    return query;
  } else {
    return { id: '' };
  }
};

// 兼容路径
const ompatiblePath = (url, url2 = '') => {
  return url2 ? path.join(url, url2) : path.resolve(url);
};

// 校验文件夹是否存在
const verifyFolder = (url) => {
  try {
    const stats = fs.statSync(ompatiblePath(url));
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
};

const verifyFile = (url) => {
  return fs.existsSync(ompatiblePath(url));
};

const getTodayDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // 获取当天的时间戳（毫秒）
  const timestamp = today.getTime();
  return timestamp;
}


module.exports = {
  errorHandler,
  parseQuery,
  encryptCode,
  decryptCode,
  encryptRichText,
  decryptRichText,
  ompatiblePath,
  verifyFile,
  verifyFolder,
  getTodayDate,
};
