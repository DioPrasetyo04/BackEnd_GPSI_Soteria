"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ValidateRequest_1 = require("../../../middlewares/ValidateRequest");
const AuthenticationValidator_1 = require("../validator/AuthenticationValidator");
const AuthenticationController_1 = require("../controllers/AuthenticationController");
const VerifyToken_1 = require("../../../middlewares/VerifyToken");
const authRoutes = express_1.default.Router();
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
authRoutes.post("/login", (0, ValidateRequest_1.validateRequest)(AuthenticationValidator_1.authSchema.omit({ name: true })), AuthenticationController_1.login);
authRoutes.post("/google", (0, ValidateRequest_1.validateRequest)(AuthenticationValidator_1.googleAuthSchema), AuthenticationController_1.googleLogin);
authRoutes.post("/facebook", (0, ValidateRequest_1.validateRequest)(AuthenticationValidator_1.facebookAuthSchema), AuthenticationController_1.facebookLogin);
authRoutes.post("/refresh", AuthenticationController_1.refreshToken);
authRoutes.post("/refresh-token", AuthenticationController_1.refreshToken);
authRoutes.post("/register", (0, ValidateRequest_1.validateRequest)(AuthenticationValidator_1.authSchema), AuthenticationController_1.register);
authRoutes.post("/resend-approval", (0, ValidateRequest_1.validateRequest)(AuthenticationValidator_1.resendApprovalSchema), AuthenticationController_1.resendApproval);
authRoutes.get("/verify-approval-info", AuthenticationController_1.getApprovalInfo);
authRoutes.post("/process-approval", (0, ValidateRequest_1.validateRequest)(AuthenticationValidator_1.processApprovalSchema), AuthenticationController_1.processApproval);
authRoutes.post("/logout", VerifyToken_1.verifyToken, AuthenticationController_1.logout);
authRoutes.post("/forgot-password", (0, ValidateRequest_1.validateRequest)(AuthenticationValidator_1.forgotPasswordSchema), AuthenticationController_1.forgotPassword);
authRoutes.get("/verify-reset-token", AuthenticationController_1.verifyResetPasswordToken);
authRoutes.post("/reset-password", (0, ValidateRequest_1.validateRequest)(AuthenticationValidator_1.resetPasswordSchema), AuthenticationController_1.resetPassword);
exports.default = authRoutes;
//# sourceMappingURL=AuthRoutes.js.map