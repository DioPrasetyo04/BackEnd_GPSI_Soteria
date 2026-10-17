import express from "express";
import { validateRequest } from "../../../middlewares/ValidateRequest";
import {
  authSchema,
  googleAuthSchema,
  facebookAuthSchema,
  refreshTokenSchema,
  resendApprovalSchema,
  processApprovalSchema,
} from "../validator/AuthenticationValidator";
import {
  login,
  googleLogin,
  facebookLogin,
  refreshToken,
  register,
  resendApproval,
  getApprovalInfo,
  processApproval,
  logout,
} from "../controllers/AuthenticationController";
import { verifyToken } from "../../../middlewares/VerifyToken";

const authRoutes: express.Router = express.Router();

/**
 * Authentication Routes
 *
 * POST /api/soteria/v1/auth/register               → Registrasi akun user baru (Status PENDING)
 * POST /api/soteria/v1/auth/resend-approval        → Kirim ulang email notifikasi verifikasi ke admin (Rate Limited 60s)
 * GET  /api/soteria/v1/auth/verify-approval-info   → Ambil info pendaftar berdasarkan approval token
 * POST /api/soteria/v1/auth/process-approval       → Proses persetujuan / penolakan akun oleh admin
 * POST /api/soteria/v1/auth/login                  → Login email-password & peroleh JWT token
 * POST /api/soteria/v1/auth/google                 → Login via Google Identity Services ID Token
 * POST /api/soteria/v1/auth/facebook               → Login via Facebook User Access Token
 * POST /api/soteria/v1/auth/refresh                → Refresh / perbarui token akses yang kedaluwarsa
 * POST /api/soteria/v1/auth/refresh-token          → Alias untuk refresh token
 * POST /api/soteria/v1/auth/logout                 → Logout & hapus sesi token (Protected via verifyToken)
 */
authRoutes.post(
  "/login",
  validateRequest(authSchema.omit({ name: true })),
  login,
);

authRoutes.post("/google", validateRequest(googleAuthSchema), googleLogin);

authRoutes.post("/facebook", validateRequest(facebookAuthSchema), facebookLogin);

authRoutes.post("/refresh", refreshToken);

authRoutes.post("/refresh-token", refreshToken);

authRoutes.post("/register", validateRequest(authSchema), register);

authRoutes.post(
  "/resend-approval",
  validateRequest(resendApprovalSchema),
  resendApproval,
);

authRoutes.get("/verify-approval-info", getApprovalInfo);

authRoutes.post(
  "/process-approval",
  validateRequest(processApprovalSchema),
  processApproval,
);

authRoutes.post("/logout", verifyToken, logout);

export default authRoutes;
