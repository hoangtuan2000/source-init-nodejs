const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false, // Encrypt connection to protect data (If using Azure SQL)
    enableArithAbort: true,
  },
  requestTimeout: parseInt(process.env.DB_REQUEST_TIMEOUT)
};

let poolPromise;

async function getConnection() {
  if (!poolPromise) {
    poolPromise = sql
      .connect(config)
      .then((pool) => {
        if (pool.connected) console.log("Connected to SQL Server");
        return pool;
      })
      .catch((err) => console.error("Database Connection Failed!", err));
  }
  const pool = await poolPromise;
  return pool;
}

module.exports = {
  sql,
  getConnection,
};
