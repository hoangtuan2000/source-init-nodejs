import { Express } from "express";
import AuthRoutes from "../routes/authRoutes";
import DepartmentRoutes from "../routes/departmentRoutes";

export const setupPaths = (app: Express) => {
  app.use("/api", AuthRoutes);
  app.use("/api/department", DepartmentRoutes);
};
