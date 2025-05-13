import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { IAccountByJWT } from "../model/auth";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";

const generateAccessToken = (account: IAccountByJWT) => {
  const accessToken = jwt.sign(
    {
      roleId: account?.roleId,
      accountId: account?.accountId,
      userName: account?.userName,
      fullName: account?.fullName,
    },
    SECRET_KEY,
    {
      expiresIn: "15m", // Access token expires in 15 minutes
    }
  );

  return accessToken;
};

const generateRefreshToken = (account: IAccountByJWT) => {
  const refreshToken = jwt.sign(
    {
      roleId: account?.roleId,
      accountId: account?.accountId,
      userName: account?.userName,
      fullName: account?.fullName,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d", // Refresh token expires in 7 days
    }
  );

  return refreshToken;
};

export { generateAccessToken, generateRefreshToken };
