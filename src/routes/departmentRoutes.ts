import express from "express";

import handleValidationErrors from "../utils/handleValidationErrors";
import { authenticateToken } from "../middleware/authMiddleware";
import { validateDepartment } from "../validators";

import {
  checkExist,
  getAllDepartment,
  getPageDepartment,
  getDetailDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentControllers";

const router = express.Router();

router.get(
  "/getAll",
  authenticateToken([]),
  validateDepartment,
  handleValidationErrors,
  getAllDepartment,
);

router.get(
  "/getPage",
  authenticateToken([]),
  validateDepartment,
  handleValidationErrors,
  getPageDepartment,
);

router.get(
  "/detail",
  authenticateToken([]),
  validateDepartment,
  handleValidationErrors,
  getDetailDepartment,
);

router.post(
  "/create",
  authenticateToken([]),
  validateDepartment,
  handleValidationErrors,
  createDepartment,
);

router.post(
  "/update",
  authenticateToken([]),
  validateDepartment,
  handleValidationErrors,
  updateDepartment,
);

router.delete(
  "/delete",
  authenticateToken([]),
  validateDepartment,
  handleValidationErrors,
  deleteDepartment,
);

export default router;
