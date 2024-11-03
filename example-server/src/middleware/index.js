const {
  userValidator,
  verifyUser,
  bcryptPassword,
  bcryptPhone,
  verifyPhone,
  verifyLogin,
  verifyUpdateInfo,
  verifyUserExists,
  verifyUserExistsByUsername,
  verifyAdminUserExistsByUsername,
  verifyAdminLogin,
  verifyAdminUpdateInfo,
  verifyAdminUser,
  verifyAdminUserExists,
} = require('./user.middleware');

const { auth, adminAuth } = require('./auth.middleware');

const { verifyCollection, countApiCalls } = require('./common.middleware');

module.exports = {
  userValidator,
  verifyUser,
  bcryptPassword,
  bcryptPhone,
  verifyPhone,
  verifyLogin,
  verifyUpdateInfo,
  verifyUserExists,
  verifyUserExistsByUsername,
  verifyAdminUserExistsByUsername,
  verifyAdminLogin,
  verifyAdminUpdateInfo,
  auth,
  adminAuth,
  verifyCollection,
  countApiCalls,
  verifyAdminUser,
  verifyAdminUserExists,
};
