import { sql } from "../config/dbConfig";
import { addAccountToCacheRedis, removeAccountFromCacheRedis } from "./cacheReAuthAccount";

const addReAuthAccount = async ({ transaction, accountId }: { transaction: any, accountId: string }) => {
  // Check if accountId exists in ReAuthAccount table, if exists then update info, if not exist then insert
  await transaction
    .request()
    .input("accountId", sql.Int, accountId)
    .query(`INSERT INTO ReAuthAccount VALUES (@accountId)`);

  // Delete accountId from cache and add back to cache
  await removeAccountFromCacheRedis(accountId);
  await addAccountToCacheRedis(accountId);
};

const removeReAuthAccount = async ({ transaction, accountId }: { transaction: any, accountId: string }) => {
  // Delete accountId from ReAuthAccount table database
  await transaction
    .request()
    .input("accountId", sql.Int, accountId)
    .query(`DELETE FROM ReAuthAccount WHERE accountId = @accountId`);

  // Clear accountId from cache
  await removeAccountFromCacheRedis(accountId);
};

export { addReAuthAccount, removeReAuthAccount };