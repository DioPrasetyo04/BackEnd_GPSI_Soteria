import jwt from "jsonwebtoken";
export interface JWTPayload {
    data?: {
        id: string;
    };
    id?: string;
    iat?: number;
    exp?: number;
    jti?: string;
    type?: "access" | "refresh";
}
export interface GeneratedToken {
    token: string;
    expiresAt: Date;
}
export interface AuthTokens {
    token: string;
    refreshToken: string;
    expiresAt: Date;
    refreshExpiresAt: Date;
}
/**
 * Generate Access Token JWT standar.
 * Durasi default: 1h (atau dari JWT_EXPIRES_IN).
 */
export declare const generateToken: (userId: string) => GeneratedToken;
/**
 * Generate Refresh Token JWT khusus.
 * Durasi default: 7d (atau dari JWT_REFRESH_EXPIRES_IN).
 */
export declare const generateRefreshToken: (userId: string) => GeneratedToken;
/**
 * Generate sepasang Access Token dan Refresh Token sekaligus.
 */
export declare const generateAuthTokens: (userId: string) => AuthTokens;
/**
 * Verifikasi Access Token JWT.
 */
export declare const verifyJwtToken: (token: string, options?: jwt.VerifyOptions) => JWTPayload;
/**
 * Verifikasi Refresh Token JWT.
 */
export declare const verifyRefreshToken: (token: string) => JWTPayload;
/**
 * Decode JWT token tanpa melempar error saat kedaluwarsa.
 */
export declare const decodeJwtToken: (token: string) => JWTPayload | null;
//# sourceMappingURL=jwt.d.ts.map