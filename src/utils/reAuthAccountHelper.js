const { sql } = require("../config/dbConfig");
const {
  removeAccountFromCache,
  addAccountToCache,
} = require("./cacheReAuthAccount");
const { getDateTimeUTC } = require("./helpers");

const addReAuthAccount = async ({ transaction, accountID, updateBy }) => {
  // Check if accountID exists in ReAuthAccount table, if exists then update info, if not exist then insert
  await transaction
    .request()
    .input("accountID", sql.Int, accountID)
    .input("createBy", sql.Int, updateBy)
    .input("createdAt", sql.DateTime, getDateTimeUTC()).query(`
        MERGE INTO ReAuthAccount AS target
        USING (SELECT @accountID AS accountID) AS source
        ON target.accountID = source.accountID
        WHEN MATCHED THEN
          UPDATE SET createBy = @createBy, createdAt = @createdAt
        WHEN NOT MATCHED THEN
          INSERT (accountID, createBy, createdAt)
          VALUES (@accountID, @createBy, @createdAt);
      `);

  // Delete accountID from cache and add back to cache
  await removeAccountFromCache(accountID);
  await addAccountToCache(accountID);
};

const removeReAuthAccount = async ({ transaction, accountID }) => {
  // Delete accountID from ReAuthAccount table database
  await transaction
    .request()
    .input("accountID", sql.Int, accountID)
    .query("DELETE FROM ReAuthAccount WHERE accountID = @accountID");

  // Clear accountID from cache
  await removeAccountFromCache(accountID);
};

module.exports = { addReAuthAccount, removeReAuthAccount };
