const GlobalRoutes = require("../../routes/globalRoutes/globalRoutes");
const AuthRoutes = require("../../routes/globalRoutes/authRoutes");

exports.setupPaths = function (app) {
  app.use("/api/global", GlobalRoutes);
  app.use("/api", AuthRoutes);
};
