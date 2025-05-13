import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";

dotenv.config();

// Create Redis client
const reAuthAccountRedis: RedisClientType = createClient({
  url: `redis://${process.env.RD_SERVER}:${process.env.RD_PORT}`,
});

// Connect Redis
reAuthAccountRedis.connect().catch(console.error);

reAuthAccountRedis.on("connect", () => {
  console.log("Connected reAuthAccountRedis to Redis successfully!");
});

export default reAuthAccountRedis;