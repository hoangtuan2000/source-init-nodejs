const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = (account) => {
  const accessToken = jwt.sign(
    {
      accountID: account.accountID,
      accountCode: account.accountCode,
    },
    SECRET_KEY,
    {
      expiresIn: "1d", // Access token expires in 15 minutes
    }
  );

  return accessToken;
};

const generateRefreshToken = (account) => {
  const refreshToken = jwt.sign(
    {
      accountID: account.accountID,
      accountCode: account.accountCode,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d", // Refresh token expires in 7 days
    }
  );

  return refreshToken;
};

module.exports = { generateAccessToken, generateRefreshToken };
