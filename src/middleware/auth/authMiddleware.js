const _ = require("lodash");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const strings = require("../../constant/strings");
const { errorResponse } = require("../../utils/responseFormatter");
const { isAccountInCache } = require("../../utils/cacheReAuthAccount");

const secretKey = process.env.SECRET_KEY;

const authenticateToken = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
      return errorResponse(res, null, strings.common.ACCESS_DENIED, 403);
    }

    jwt.verify(token, secretKey, async (err, account) => {
      if (err) {
        return errorResponse(
          res,
          err,
          "Phiên Đăng Nhập Hết Hạn\nVui Lòng Đăng Nhập Lại!",
          401
        );
      }

      const { accountID, roleID } = account;

      // Check if accountID is in cache
      if (await isAccountInCache(accountID)) {
        return errorResponse(
          res,
          null,
          "Tài Khoản Của Bạn Đã Được Cập Nhật.\nVui Lòng Đăng Nhập Lại!",
          409
        );
      }

      // Check Roles
      if (roles.length && !roles.includes(roleID)) {
        return errorResponse(res, null, strings.common.ACCESS_DENIED, 403);
      }

      req.currentAccount = account;
      next();
    });
  };
};

module.exports = {
  authenticateToken,
};
