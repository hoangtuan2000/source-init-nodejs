const redis = require("redis");
require("dotenv").config();

// Create Redis client
const reAuthAccountRedis = redis.createClient({
  url: `redis://${process.env.RD_SERVER}:${process.env.RD_PORT}`,
});

// Connect Redis
reAuthAccountRedis.connect().catch(console.error);

reAuthAccountRedis.on("connect", () => {
  console.log("Connected reAuthAccountRedis to Redis successfully!");
});

module.exports = reAuthAccountRedis;
