const bcrypt = require("bcryptjs");
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { sql, getConnection } from "../config/dbConfig";

import { IAccount } from "../model/auth";
import { removeReAuthAccount } from "../utils/reAuthAccountHelper";
import { successResponse, errorResponse } from "../utils/responseFormatter";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtHelpers";

import strings from "../constant/strings";
import constants from "../constant/constants";

dotenv.config();

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";

const login = async (req: any, res: any) => {
  const { userName, password } = req.body;

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("userName", sql.VarChar, userName)
      .query(`
        SELECT * FROM Account WHERE accountCode = @userName
      `);

    if (result.recordset.length === 0) {
      return errorResponse({ res, error: null, message: strings.auth.USER_NOT_FOUND, statusCode: 404 });
    }

    const account: IAccount = result.recordset[0];
    if (account.status == constants.status.DISABLE) {
      return errorResponse({ res, error: null, message: strings.auth.ACCOUNT_LOCKED, statusCode: 423 });
    }

    const passwordIsValid = bcrypt.compareSync(password, account.password);

    if (!passwordIsValid) {
      return errorResponse({ res, error: null, message: strings.auth.INVALID_PASSWORD, statusCode: 402 });
    }

    await removeReAuthAccount({
      transaction: pool,
      accountId: account.id,
    });

    const accessToken = generateAccessToken({
      accountId: account.id,
      roleId: account.roleId,
      fullName: account.fullName,
      userName: account.accountCode,
    });

    const refreshToken = generateRefreshToken({
      accountId: account.id,
      roleId: account.roleId,
      fullName: account.fullName,
      userName: account.accountCode,
    });

    successResponse({
      res,
      data: {
        accountId: account.id,
        fullName: account.fullName,
        userCode: account.accountCode,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      message: strings.common.SUCCESS,
      pagination: null,
      statusCode: 200,
    });
  } catch (error: any) {
    errorResponse({
      res,
      error,
      message: error?.errorMessage || strings.error.INTERNAL_SERVER_ERROR,
      statusCode: error?.statusCode,
    });
  }
};

const refreshToken = (req: any, res: any) => {
  const { refreshToken } = req.body;

  if (refreshToken == null) {
    return errorResponse({ res, error: null, message: strings.auth.REFRESH_TOKEN_REQUIRED, statusCode: 400 });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, account: any) => {
    if (err) {
      return errorResponse({ res, error: err, message: strings.auth.INVALID_REFRESH_TOKEN, statusCode: 403 });
    }

    const newAccessToken = generateAccessToken(account);

    successResponse({
      res,
      data: { accessToken: newAccessToken },
      message: strings.auth.TOKEN_REFRESHED_SUCCESSFULLY,
      pagination: null,
      statusCode: 200,
    });
  });
};

export {
  login,
  refreshToken,
};