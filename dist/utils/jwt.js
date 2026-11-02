"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJwtToken = exports.verifyRefreshToken = exports.verifyJwtToken = exports.generateAuthTokens = exports.generateRefreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helpers_1 = require("./helpers");
const nanoid_1 = require("nanoid");
const getAccessTokenSecret = () => (process.env.JWT_SECRET_KEY ?? "secret");
const getRefreshTokenSecret = () => (process.env.JWT_REFRESH_SECRET_KEY ??
    `${process.env.JWT_SECRET_KEY ?? "secret"}_refresh`);
/**
 * Generate Access Token JWT standar.
 * Durasi default: 1h (atau dari JWT_EXPIRES_IN).
 */
const generateToken = (userId) => {
    const secretKey = getAccessTokenSecret();
    const expValue = process.env.JWT_EXPIRES_IN ?? "1h";
    const exp = expValue;
    const token = jsonwebtoken_1.default.sign({
        id: userId,
        data: { id: userId },
        type: "access",
        jti: (0, nanoid_1.nanoid)(12),
    }, secretKey, { expiresIn: exp });
    const expiresAt = new Date(Date.now() + (0, helpers_1.expiresInMs)(expValue));
    return { token, expiresAt };
};
exports.generateToken = generateToken;
/**
 * Generate Refresh Token JWT khusus.
 * Durasi default: 7d (atau dari JWT_REFRESH_EXPIRES_IN).
 */
const generateRefreshToken = (userId) => {
    const secretKey = getRefreshTokenSecret();
    const expValue = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";
    const exp = expValue;
    const token = jsonwebtoken_1.default.sign({
        id: userId,
        data: { id: userId },
        type: "refresh",
        jti: (0, nanoid_1.nanoid)(12),
    }, secretKey, { expiresIn: exp });
    const expiresAt = new Date(Date.now() + (0, helpers_1.expiresInMs)(expValue));
    return { token, expiresAt };
};
exports.generateRefreshToken = generateRefreshToken;
/**
 * Generate sepasang Access Token dan Refresh Token sekaligus.
 */
const generateAuthTokens = (userId) => {
    const access = (0, exports.generateToken)(userId);
    const refresh = (0, exports.generateRefreshToken)(userId);
    return {
        token: access.token,
        refreshToken: refresh.token,
        expiresAt: access.expiresAt,
        refreshExpiresAt: refresh.expiresAt,
    };
};
exports.generateAuthTokens = generateAuthTokens;
/**
 * Verifikasi Access Token JWT.
 */
const verifyJwtToken = (token, options) => {
    const secretKey = getAccessTokenSecret();
    return jsonwebtoken_1.default.verify(token, secretKey, options);
};
exports.verifyJwtToken = verifyJwtToken;
/**
 * Verifikasi Refresh Token JWT.
 */
const verifyRefreshToken = (token) => {
    const secretKey = getRefreshTokenSecret();
    return jsonwebtoken_1.default.verify(token, secretKey);
};
exports.verifyRefreshToken = verifyRefreshToken;
/**
 * Decode JWT token tanpa melempar error saat kedaluwarsa.
 */
const decodeJwtToken = (token) => {
    try {
        return jsonwebtoken_1.default.decode(token);
    }
    catch {
        return null;
    }
};
exports.decodeJwtToken = decodeJwtToken;
//# sourceMappingURL=jwt.js.map