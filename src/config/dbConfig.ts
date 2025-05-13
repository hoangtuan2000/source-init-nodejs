import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config: any = {
  user: process.env.DB_USER,
  server: process.env.DB_SERVER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || "0"),
  options: {
    encrypt: false, // Encrypt connection to protect data (If using Azure SQL)
    enableArithAbort: true,
  },
  requestTimeout: parseInt(process.env.DB_REQUEST_TIMEOUT || "0")
};

const getConnection = async () => {
  let poolPromise;
  if (!poolPromise) {
    poolPromise = sql
      .connect(config)
      .then((pool: any) => {
        if (pool.connected) console.log("Connected to SQL Server");
        return pool;
      })
      .catch((err: any) => console.error("Database Connection Failed!", err));
  }
  const pool = await poolPromise;
  return pool;
}

export { sql, getConnection };
