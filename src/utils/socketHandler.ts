import Redis from "ioredis";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

dotenv.config();


// Initialize Redis clients using ioredis
const pubClient = new Redis({
  port: process.env.RD_PORT, // Port Redis
  host: process.env.RD_SERVER, // Address Redis server
} as any);

const subClient = pubClient.duplicate(); // Create a secondary client for Sub

// Connect Redis
pubClient
  .on("connect", () => {
    console.log("Connected to Redis for Socket.IO");
  })
  .on("error", (err) => {
    console.error("Redis for Socket.IO connection error:", err);
  });

// Initialize Socket.IO
let io: any;

const initializeSocket = (server: any) => {
  io = new Server(server, {
    // path: '/socket.io',
    cors: {
      origin: "*", // [process.env.URL_FRONTEND],
      methods: ["GET", "POST", "DELETE"],
    },
    pingTimeout: 120000, // Maximum time between pings (120s)
    pingInterval: 10000, // Ping frequency from the server to the client
  });

  // Add Redis adapter to Socket.IO
  io.adapter(createAdapter(pubClient, subClient));

  // Listen for the connection event
  io.on("connection", (socket: any) => {
    // CONNECT
    console.warn("user connect socket: ", socket.id);

    // Handle Socket Event

    // DISCONNECT
    socket.on("disconnect", () => {
      console.warn(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}



const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized!");
  }
  return io;
}

export { initializeSocket, getIO };
