const express = require("express");
const router = express.Router();

const handleValidationErrors = require("../../utils/handleValidationErrors");
const { authenticateToken } = require("../../middleware/auth/authMiddleware");
const {
  createGlobal,
} = require("../../controllers/globalControllers/globalControllers");
const {
  validatePagination,
} = require("../../validators/globalValidators/globalValidators");
const { checkExist } = require("../../middleware/global/globalMiddleware");

router.post(
  "/create",
  authenticateToken([]),
  validatePagination, // validate params
  handleValidationErrors,
  checkExist, // middleware
  createGlobal
);

module.exports = router;
