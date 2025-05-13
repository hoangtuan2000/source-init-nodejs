import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import strings from "../constant/strings";
import { IAccountByJWT } from "../model/auth";
import { errorResponse } from "../utils/responseFormatter";
import { isAccountInCacheRedis } from "../utils/cacheReAuthAccount";

dotenv.config();

const secretKey = process.env.SECRET_KEY || "";

const authenticateToken = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
      return errorResponse({ res, error: null, message: strings.common.ACCESS_DENIED, statusCode: 403 });
    }

    jwt.verify(token, secretKey, async (err: any, account: any) => {
      if (err) {
        return errorResponse({
          res,
          error: err,
          message: "Phiên Đăng Nhập Hết Hạn\nVui Lòng Đăng Nhập Lại!",
          statusCode: 401,
        });
      }

      const { accountId, roleId }: IAccountByJWT = account;

      // Check if accountId is in cache
      if (await isAccountInCacheRedis(accountId)) {
        return errorResponse({
          res,
          error: null,
          message: "Tài Khoản Của Bạn Đã Được Cập Nhật.\nVui Lòng Đăng Nhập Lại!",
          statusCode: 409,
        });
      }

      // Check Roles
      if (roles.length && !roles.includes(roleId)) {
        return errorResponse({
          res,
          error: null,
          message: strings.common.ACCESS_DENIED,
          statusCode: 403,
        });
      }

      req.currentAccount = account;
      next();
    });
  };
};

export { authenticateToken };