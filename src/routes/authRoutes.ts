import express from "express";

import { validateLogin } from "../validators";
import { login } from "../controllers/authController";
import { refreshToken } from "../controllers/authController";

import handleValidationErrors from "../utils/handleValidationErrors";

const router = express.Router();

router.post("/login", validateLogin, handleValidationErrors, login);

router.post("/refresh-token", refreshToken);

export default router;
