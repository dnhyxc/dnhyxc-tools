const path = require("path");
const fs = require('fs');
const CryptoJS = require("crypto-js");
const md5 = require("js-md5");

const key = CryptoJS.enc.Utf8.parse(md5("DNHYXC2017202009")); // 十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse(md5("DNHWYHDCXDZC1926")); // 十六位十六进制数作为密钥偏移量

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
  let status = 500;
  switch (err.code) {
    case "10001":
      status = 200;
      break;
    case "10002":
      status = 200;
      break;
    case "10003":
      status = 200;
      break;
    case "10004":
      status = 200;
      break;
    case "10005":
      status = 200;
      break;
    case "10006":
      status = 409;
      break;
    case "10009":
      status = 406;
    case "10008":
      status = 200;
      break;
    case "10101":
      status = 401;
      break;
    case "10102":
      status = 409;
      break;
    default:
      status = 500;
      break;
  }
  ctx.status = status;
  ctx.body = err;
};

// 获取高级搜索搜索条件
const getAdvancedSearchFilter = ({ filterList, keyword }) => {
  const keywordReg = (keyword && new RegExp(keyword, "i")) || "";

  const filters = [];

  if (filterList.includes("title")) {
    filters.push({ title: { $regex: keywordReg } });
  }

  if (filterList.includes("tag")) {
    filters.push({ tag: { $regex: keywordReg } });
  }

  if (filterList.includes("classify")) {
    filters.push({ classify: { $regex: keywordReg } });
  }

  if (filterList.includes("abstract")) {
    filters.push({ abstract: { $regex: keywordReg } });
  }

  if (filterList.includes("authorName")) {
    filters.push({ authorName: { $regex: keywordReg } });
  }

  if (filterList.includes("content")) {
    filters.push({ content: { $regex: keywordReg } });
  }

  if (filterList.includes("articleId")) {
    filters.push({ articleId: { $regex: keywordReg } });
  }

  const filterKey = filters.length
    ? {
      $or: filters,
      isDelete: { $nin: [true] },
    }
    : {
      isDelete: { $nin: [true] },
      $or: [
        { title: { $regex: keywordReg } },
        { tag: { $regex: keywordReg } },
        { classify: { $regex: keywordReg } },
        { abstract: { $regex: keywordReg } },
        { content: { $regex: keywordReg } },
        { authorName: { $regex: keywordReg } },
        { articleId: { $regex: keywordReg } },
      ],
    };

  return filterKey;
};

// 获取高级搜索排序条件
const getSortType = (filterList) => {
  let sortType = {};

  if (filterList.includes("all")) {
    sortType = {};
  }
  if (filterList.includes("likeCount")) {
    sortType.likeCount = -1;
  }

  return sortType;
};

// 解析 ws query 参数
const parseQuery = (url) => {
  const lastIndex = url.lastIndexOf("?");

  if (lastIndex > -1) {
    const search = url.substring(lastIndex + 1, url.length);
    const pairs = search ? search.split("&") : [];
    const query = {};
    for (let i = 0; i < pairs.length; ++i) {
      const [key, value] = pairs[i].split("=");
      query[key] = value;
    }
    return query;
  } else {
    return { id: "" };
  }
};

// 数组根据某相同字段进行分组
const formateArrData = (initialArr, name) => {
  // 先获取一下这个数组中有多少个"name"
  let nameArr = [];
  for (let i in initialArr) {
    if (nameArr.indexOf(initialArr[i][`${name}`]) === -1) {
      nameArr.push(initialArr[i][`${name}`]);
    }
  }
  // 新建一个包含多个list的结果对象
  let tempObj = {};
  // 根据不同的"name"生成多个数组
  for (let k in nameArr) {
    for (let j in initialArr) {
      if (initialArr[j][`${name}`] == nameArr[k]) {
        // 每次外循环时新建一个对应"name"的数组, 内循环时当前数组不变
        tempObj[nameArr[k]] = tempObj[nameArr[k]] || [];
        tempObj[nameArr[k]].push(initialArr[j]);
      }
    }
  }
  return tempObj;
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
  getAdvancedSearchFilter,
  getSortType,
  parseQuery,
  formateArrData,
  encryptCode,
  decryptCode,
  encryptRichText,
  decryptRichText,
  ompatiblePath,
  verifyFile,
  verifyFolder,
  getTodayDate,
};
