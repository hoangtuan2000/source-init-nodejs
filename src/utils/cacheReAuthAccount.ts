import { getConnection } from "../config/dbConfig";
import reAuthAccountRedis from "./reAuthAccountRedis";

const generateReAuthKey = (accountId: string) => {
  return `reAuthAcc:${accountId}`;
};

// Load data into cache
const loadReAuthAccountIntoCache = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT * FROM ReAuthAccount"); // replace with sql command

    for (let row of result.recordset) {
      await reAuthAccountRedis.set(generateReAuthKey(row.accountId), "true");
    }
    console.log("ReAuth Account saved to Redis successfully.");
  } catch (error) {
    console.error("Error loading cache:", error);
  }
};

// Check if accountId is in cache
const isAccountInCacheRedis = async (accountId: string) => {
  try {
    const result = await reAuthAccountRedis.get(generateReAuthKey(accountId));
    return result !== null;
  } catch (error) {
    console.error("Error checking cache:", error);
    return false;
  }
};

// Clear accountId from cache
const removeAccountFromCacheRedis = async (accountId: string) => {
  try {
    await reAuthAccountRedis.del(generateReAuthKey(accountId));
  } catch (error) {
    console.error("Error removing from cache:", error);
  }
};

// Add accountId to cache
const addAccountToCacheRedis = async (accountId: string) => {
  try {
    await reAuthAccountRedis.set(generateReAuthKey(accountId), "true");
  } catch (error) {
    console.error("Error adding to cache:", error);
  }
};

export {
  isAccountInCacheRedis,
  addAccountToCacheRedis,
  removeAccountFromCacheRedis,

  loadReAuthAccountIntoCache,
};
