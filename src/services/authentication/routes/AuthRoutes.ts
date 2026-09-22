import express from "express";
import { validateRequest } from "../../../middlewares/ValidateRequest";
import { authSchema } from "../validator/AuthenticationValidator";
import {
  login,
  register,
  logout,
} from "../controllers/AuthenticationController";
import { verifyToken } from "../../../middlewares/VerifyToken";

const authRoutes: express.Router = express.Router();

/**
 * Authentication Routes
 *
 * POST /api/auth/register → Registrasi akun user baru
 * POST /api/auth/login    → Login & peroleh JWT token
 * POST /api/auth/logout   → Logout & hapus sesi token (Protected via verifyToken)
 */
authRoutes.post(
  "/login",
  validateRequest(authSchema.omit({ name: true })),
  login,
);

authRoutes.post("/register", validateRequest(authSchema), register);

authRoutes.post("/logout", verifyToken, logout);

export default authRoutes;
