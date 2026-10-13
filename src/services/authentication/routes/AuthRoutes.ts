import express from "express";
import { validateRequest } from "../../../middlewares/ValidateRequest";
import {
  authSchema,
  googleAuthSchema,
  facebookAuthSchema,
} from "../validator/AuthenticationValidator";
import {
  login,
  googleLogin,
  facebookLogin,
  register,
  logout,
} from "../controllers/AuthenticationController";
import { verifyToken } from "../../../middlewares/VerifyToken";

const authRoutes: express.Router = express.Router();

/**
 * Authentication Routes
 *
 * POST /api/soteria/v1/auth/register → Registrasi akun user baru
 * POST /api/soteria/v1/auth/login    → Login email-password & peroleh JWT token
 * POST /api/soteria/v1/auth/google   → Login via Google Identity Services ID Token
 * POST /api/soteria/v1/auth/facebook → Login via Facebook User Access Token
 * POST /api/soteria/v1/auth/logout   → Logout & hapus sesi token (Protected via verifyToken)
 */
authRoutes.post(
  "/login",
  validateRequest(authSchema.omit({ name: true })),
  login,
);

authRoutes.post("/google", validateRequest(googleAuthSchema), googleLogin);

authRoutes.post("/facebook", validateRequest(facebookAuthSchema), facebookLogin);

authRoutes.post("/register", validateRequest(authSchema), register);

authRoutes.post("/logout", verifyToken, logout);

export default authRoutes;


