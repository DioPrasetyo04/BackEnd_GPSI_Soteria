"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyResetPasswordToken = exports.forgotPassword = exports.logout = exports.processApproval = exports.getApprovalInfo = exports.resendApproval = exports.register = exports.refreshToken = exports.facebookLogin = exports.googleLogin = exports.login = void 0;
const AuthenticationValidator_1 = require("../validator/AuthenticationValidator");
const AuthRepositories_1 = require("../repositories/AuthRepositories");
const AuthServices_1 = require("../services/AuthServices");
const UserRpositories_1 = require("../../user/repositories/UserRpositories");
const response_1 = __importDefault(require("../../../utils/response"));
const authRepo = new AuthRepositories_1.AuthRepositories();
const userRepo = new UserRpositories_1.UserRepositories();
const authServices = new AuthServices_1.AuthServices(authRepo, userRepo);
const login = async (req, res, next) => {
    try {
        const parsedData = AuthenticationValidator_1.authSchema
            .omit({
            name: true,
        })
            .parse(req.body);
        const result = await authServices.login(parsedData.email, parsedData.password);
        (0, response_1.default)(res, 200, "Login berhasil", result);
    }
    catch (error) {
        // Jika status akun PENDING atau REJECTED, teruskan error dengan metadata khusus
        if (error.code === "ACCOUNT_PENDING") {
            res.status(403).json({
                status: "fail",
                code: "ACCOUNT_PENDING",
                message: error.message,
                data: error.data || null,
            });
            return;
        }
        if (error.code === "ACCOUNT_REJECTED") {
            res.status(403).json({
                status: "fail",
                code: "ACCOUNT_REJECTED",
                message: error.message,
                data: null,
            });
            return;
        }
        next(error);
    }
};
exports.login = login;
const googleLogin = async (req, res, next) => {
    try {
        const parsedData = AuthenticationValidator_1.googleAuthSchema.parse(req.body);
        const result = await authServices.googleLogin(parsedData.idToken);
        (0, response_1.default)(res, 200, "Login Google berhasil", result);
    }
    catch (error) {
        next(error);
    }
};
exports.googleLogin = googleLogin;
const facebookLogin = async (req, res, next) => {
    try {
        const parsedData = AuthenticationValidator_1.facebookAuthSchema.parse(req.body);
        const result = await authServices.facebookLogin(parsedData.accessToken);
        (0, response_1.default)(res, 200, "Login Facebook berhasil", result);
    }
    catch (error) {
        next(error);
    }
};
exports.facebookLogin = facebookLogin;
const refreshToken = async (req, res, next) => {
    try {
        const authHeader = req.headers?.authorization;
        const bearerToken = authHeader &&
            (authHeader.startsWith("Bearer ") || authHeader.startsWith("JWT "))
            ? authHeader.split(" ")[1]
            : undefined;
        const bodyToken = req.body?.refreshToken || req.body?.token;
        const tokenToRefresh = bodyToken || bearerToken;
        if (!tokenToRefresh) {
            (0, response_1.default)(res, 400, "Token atau refresh token tidak ditemukan", null);
            return;
        }
        const result = await authServices.refreshToken(tokenToRefresh);
        (0, response_1.default)(res, 200, "Token berhasil diperbarui", result);
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
const register = async (req, res, next) => {
    try {
        const result = await authServices.register(req.body);
        (0, response_1.default)(res, 201, "Pendaftaran berhasil. Akun Anda sedang menunggu verifikasi oleh Administrator.", result);
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const resendApproval = async (req, res, next) => {
    try {
        const parsed = AuthenticationValidator_1.resendApprovalSchema.parse(req.body);
        const result = await authServices.resendApproval(parsed.email);
        (0, response_1.default)(res, 200, result.message, result);
    }
    catch (error) {
        if (error.statusCode === 429 || error.status === 429) {
            res.status(429).json({
                status: "fail",
                code: "RATE_LIMITED",
                message: error.message,
                data: error.data || null,
            });
            return;
        }
        next(error);
    }
};
exports.resendApproval = resendApproval;
const getApprovalInfo = async (req, res, next) => {
    try {
        const token = String(req.query.token || req.params.token || "");
        const result = await authServices.getApprovalInfo(token);
        (0, response_1.default)(res, 200, "Informasi pendaftaran ditemukan", result);
    }
    catch (error) {
        next(error);
    }
};
exports.getApprovalInfo = getApprovalInfo;
const processApproval = async (req, res, next) => {
    try {
        const parsed = AuthenticationValidator_1.processApprovalSchema.parse(req.body);
        const result = await authServices.processApproval(parsed.token, parsed.action, parsed.reason);
        (0, response_1.default)(res, 200, result.message, result);
    }
    catch (error) {
        next(error);
    }
};
exports.processApproval = processApproval;
const logout = async (req, res, next) => {
    try {
        const authHeader = req.headers?.authorization;
        const token = authHeader?.split(" ")[1];
        const identifier = token || req.user?.id;
        if (!identifier) {
            (0, response_1.default)(res, 400, "Token atau sesi login tidak ditemukan", null);
            return;
        }
        await authServices.logout(identifier);
        (0, response_1.default)(res, 200, "Logout berhasil", null);
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
const forgotPassword = async (req, res, next) => {
    try {
        const parsedData = AuthenticationValidator_1.forgotPasswordSchema.parse(req.body);
        const result = await authServices.forgotPassword(parsedData.email);
        (0, response_1.default)(res, 200, result.message, result);
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
const verifyResetPasswordToken = async (req, res, next) => {
    try {
        const token = String(req.query.token || req.body?.token || "");
        const parsed = AuthenticationValidator_1.verifyResetTokenSchema.parse({ token });
        const result = await authServices.verifyResetToken(parsed.token);
        (0, response_1.default)(res, 200, "Token valid", result);
    }
    catch (error) {
        next(error);
    }
};
exports.verifyResetPasswordToken = verifyResetPasswordToken;
const resetPassword = async (req, res, next) => {
    try {
        const parsed = AuthenticationValidator_1.resetPasswordSchema.parse(req.body);
        const result = await authServices.resetPassword(parsed.token, parsed.newPassword);
        (0, response_1.default)(res, 200, result.message, result);
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=AuthenticationController.js.map