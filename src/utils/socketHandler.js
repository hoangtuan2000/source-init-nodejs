const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const Redis = require("ioredis"); // Import ioredis

require("dotenv").config();

// Initialize Redis clients using ioredis
const pubClient = new Redis({
  host: process.env.RD_SERVER, // Address Redis server
  port: process.env.RD_PORT, // Port Redis
});

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
let io;

function initializeSocket(server) {
  io = new Server(server, {
    // path: '/socket.io',
    cors: {
      origin: [process.env.URL_FRONTEND],
      methods: ["GET", "POST"],
    },
    pingTimeout: 120000, // Maximum time between pings (120s)
    pingInterval: 10000, // Ping frequency from the server to the client
  });

  // Add Redis adapter to Socket.IO
  io.adapter(createAdapter(pubClient, subClient));

  // Listen for the connection event
  io.on("connection", (socket) => {
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

// Function to access io from other modules
function getIO() {
  if (!io) {
    throw new Error("Socket.IO has not been initialized!");
  }
  return io;
}

module.exports = { initializeSocket, getIO };
