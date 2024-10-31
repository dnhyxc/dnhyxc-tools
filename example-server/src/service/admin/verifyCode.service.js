const { AdminVerifyCodes } = require("../../models");
const { CHARACTERS } = require("../../config");
const { decryptCode, encryptCode } = require("../../utils");

class AdminVerifyCodeServer {
  // 添加验证码
  async adminVerifyCode({ codeId }) {
    codeId && (await AdminVerifyCodes.deleteOne({ _id: codeId }));
    let txt = "";
    for (let i = 0; i < 4; i++) {
      txt +=
        CHARACTERS[Math.floor(Math.random() * (CHARACTERS.length - 0) + 0)];
    }
    const res = await AdminVerifyCodes.create({
      createTime: new Date().valueOf(),
      code: encryptCode(txt),
    });
    return {
      id: res._id,
      createTime: res.createTime,
      code: res.code,
    };
  }

  // 校验验证码
  async adminCheckVerifyCode({ codeId, code }) {
    const res = await AdminVerifyCodes.findOne({ _id: codeId });
    if (!res) return false;
    await AdminVerifyCodes.deleteOne({ _id: codeId });
    if (
      decryptCode(res.code).toLocaleLowerCase() ===
      decryptCode(code).toLocaleLowerCase()
    ) {
      return true;
    }
    return false;
  }

  // 删除验证码
  async adminDeleteVerifyCode({ codeId }) {
    const res = await AdminVerifyCodes.deleteOne({ _id: codeId });
    return res.deletedCount;
  }
}

module.exports = new AdminVerifyCodeServer();
