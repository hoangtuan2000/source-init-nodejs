const { getConnection } = require("../config/dbConfig");
const reAuthAccountRedis = require("./reAuthAccountRedis");

const generateReAuthKey = (accountID) => {
  return `reAuthAcc:${accountID}`;
};

// Load data into cache
const loadReAuthAccountIntoCache = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SQL QUERY"); // replace with sql command

    for (let row of result.recordset) {
      await reAuthAccountRedis.set(generateReAuthKey(row.accountID), "true");
    }
    console.log("ReAuth Account saved to Redis successfully.");
  } catch (error) {
    console.error("Error loading cache:", error);
  }
};

// Check if accountID is in cache
const isAccountInCache = async (accountID) => {
  try {
    const result = await reAuthAccountRedis.get(generateReAuthKey(accountID));
    return result !== null;
  } catch (error) {
    console.error("Error checking cache:", error);
    return false;
  }
};

// Clear accountID from cache
const removeAccountFromCache = async (accountID) => {
  try {
    await reAuthAccountRedis.del(generateReAuthKey(accountID));
  } catch (error) {
    console.error("Error removing from cache:", error);
  }
};

// Add accountID to cache
const addAccountToCache = async (accountID) => {
  try {
    await reAuthAccountRedis.set(generateReAuthKey(accountID), "true");
  } catch (error) {
    console.error("Error adding to cache:", error);
  }
};

module.exports = {
  loadReAuthAccountIntoCache,
  isAccountInCache,
  removeAccountFromCache,
  addAccountToCache,
};
