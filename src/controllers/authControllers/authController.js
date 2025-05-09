const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { sql, getConnection } = require("../../config/dbConfig");
const {
  successResponse,
  errorResponse,
} = require("../../utils/responseFormatter");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwtHelpers");
const constants = require("../../constant/constants");
const strings = require("../../constant/strings");
const { removeReAuthAccount } = require("../../utils/reAuthAccountHelper");
const authServices = require("../../services/authServices");

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const login = async (req, res) => {
  const { accountCode, password } = req.body;

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("accountCode", sql.NVarChar, accountCode).query(`
        SQL QUERY
      `);

    if (result.recordset.length === 0) {
      return errorResponse(res, null, strings.auth.USER_NOT_FOUND, 404);
    }

    const account = result.recordset[0];
    if (account.isActive == constants.status.DISABLE) {
      return errorResponse(res, null, strings.auth.ACCOUNT_LOCKED, 423);
    }

    const passwordIsValid = bcrypt.compareSync(password, account.password);

    if (!passwordIsValid) {
      return errorResponse(res, null, strings.auth.INVALID_PASSWORD, 402);
    }

    // After updating the user information, when the user logs back into the system, remove the user from ReAuthAccount
    await removeReAuthAccount({
      transaction: pool,
      accountID: account.accountID,
    });

    const accessToken = generateAccessToken(account);
    const refreshToken = generateRefreshToken(account);

    successResponse(
      res,
      {
        accountCode: account.accountCode,
        fullName: account.fullName,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      strings.common.SUCCESS
    );
  } catch (error) {
    errorResponse(
      res,
      error,
      error?.errorMessage || strings.error.INTERNAL_SERVER_ERROR,
      error?.statusCode
    );
  }
};

const refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken == null) {
    return errorResponse(res, null, strings.auth.REFRESH_TOKEN_REQUIRED, 400);
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, account) => {
    if (err) {
      return errorResponse(res, err, strings.auth.INVALID_REFRESH_TOKEN, 403);
    }

    const newAccessToken = generateAccessToken(account);

    successResponse(
      res,
      { accessToken: newAccessToken },
      strings.auth.TOKEN_REFRESHED_SUCCESSFULLY
    );
  });
};

module.exports = {
  login,
  refreshToken,
};
