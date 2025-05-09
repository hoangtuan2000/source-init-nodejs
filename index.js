const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const cluster = require("cluster");
const os = require("os");
const path = require("path");
require("dotenv").config();

const { initializeSocket } = require("./src/utils/socketHandler");
const { convertStringToBoolean } = require("./src/utils/helpers");

const app = express();

// Number of CPU cores of the system
const numCPUs = parseInt(process.env.NUM_CPU) || 1;

// If this is the master process, create workers
if (cluster.isMaster) {
  console.log(`Master process started. Number of CPU cores: ${numCPUs}`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // When a worker fails, recreate a new worker
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Re-initialize workers when a worker dies
  });
} else {
  setTimeout(() => {
    if (convertStringToBoolean(process.env.ENABLE_RUN_OFFLINE)) {
      app.use(express.static(path.join(__dirname, "build")));
      app.get("/fe/*", (req, res) => {
        res.sendFile(path.join(__dirname, "build", "index.html"));
      });
    }

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(
      cors({
        origin: [process.env.URL_FRONTEND],
        methods: ["GET", "POST"],
        exposedHeaders: ["X-File-Name", "X-Message", "X-Status"], // Allow write status and file name when export excel API
        // credentials: true, //pass header
      })
    );

    const server = http.createServer(app);

    if (convertStringToBoolean(process.env.ENABLE_CONSOLE_CALL_ANY_API)) {
      app.use((req, res, next) => {
        const timestamp = new Date();
        console.log(
          `User ${req.socket.remoteAddress} accessed at: ${timestamp}`,
          req.originalUrl
        );
        next();
      });
    }

    const reAuthAccountRedis = require("./src/utils/reAuthAccountRedis");

    reAuthAccountRedis.on("ready", () => {
      console.log(
        "Redis reAuthAccountRedis is connected, application can now start."
      );
    });

    const {
      loadReAuthAccountIntoCache,
    } = require("./src/utils/cacheReAuthAccount");
    loadReAuthAccountIntoCache();

    const GlobalPaths = require("./src/paths/globalPaths/globalPaths");

    GlobalPaths.setupPaths(app);

    // Create Socket.IO
    // initializeSocket(server);

    const port = process.env.PORT_SERVER || 3000;
    if (convertStringToBoolean(process.env.ENABLE_RUN_OFFLINE)) {
      server.listen(port, process.env.IP_SERVER, () => {
        console.log(`App listening on port ${port}`);
      });
    } else {
      server.listen(port, () => {
        console.log(`App listening on port ${port}`);
      });
    }

    server.timeout = parseInt(process.env.TIMEOUT);
  }, parseInt(process.env.SERVER_STARTUP_DELAY));
}
