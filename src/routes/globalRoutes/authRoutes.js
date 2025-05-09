const express = require("express");
const router = express.Router();

const handleValidationErrors = require("../../utils/handleValidationErrors");
const {
  validateLogin,
} = require("../../validators/globalValidators/globalValidators");
const {
  refreshToken,
} = require("../../controllers/authControllers/authController");

router.post("/login", validateLogin, handleValidationErrors, login);

router.post("/refresh-token", refreshToken);

module.exports = router;
