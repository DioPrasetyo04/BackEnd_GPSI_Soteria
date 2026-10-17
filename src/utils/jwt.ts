import jwt from "jsonwebtoken";
import { expiresInMs } from "./helpers";
import { nanoid } from "nanoid";

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

const getAccessTokenSecret = (): jwt.Secret =>
  (process.env.JWT_SECRET_KEY ?? "secret") as jwt.Secret;

const getRefreshTokenSecret = (): jwt.Secret =>
  (process.env.JWT_REFRESH_SECRET_KEY ??
    `${process.env.JWT_SECRET_KEY ?? "secret"}_refresh`) as jwt.Secret;

/**
 * Generate Access Token JWT standar.
 * Durasi default: 1h (atau dari JWT_EXPIRES_IN).
 */
export const generateToken = (userId: string): GeneratedToken => {
  const secretKey = getAccessTokenSecret();
  const expValue = process.env.JWT_EXPIRES_IN ?? "1h";
  const exp = expValue as jwt.SignOptions["expiresIn"];

  const token = jwt.sign(
    {
      id: userId,
      data: { id: userId },
      type: "access",
      jti: nanoid(12),
    },
    secretKey,
    { expiresIn: exp },
  );

  const expiresAt = new Date(Date.now() + expiresInMs(expValue));

  return { token, expiresAt };
};

/**
 * Generate Refresh Token JWT khusus.
 * Durasi default: 7d (atau dari JWT_REFRESH_EXPIRES_IN).
 */
export const generateRefreshToken = (userId: string): GeneratedToken => {
  const secretKey = getRefreshTokenSecret();
  const expValue = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";
  const exp = expValue as jwt.SignOptions["expiresIn"];

  const token = jwt.sign(
    {
      id: userId,
      data: { id: userId },
      type: "refresh",
      jti: nanoid(12),
    },
    secretKey,
    { expiresIn: exp },
  );


  const expiresAt = new Date(Date.now() + expiresInMs(expValue));

  return { token, expiresAt };
};

/**
 * Generate sepasang Access Token dan Refresh Token sekaligus.
 */
export const generateAuthTokens = (userId: string): AuthTokens => {
  const access = generateToken(userId);
  const refresh = generateRefreshToken(userId);

  return {
    token: access.token,
    refreshToken: refresh.token,
    expiresAt: access.expiresAt,
    refreshExpiresAt: refresh.expiresAt,
  };
};

/**
 * Verifikasi Access Token JWT.
 */
export const verifyJwtToken = (
  token: string,
  options?: jwt.VerifyOptions,
): JWTPayload => {
  const secretKey = getAccessTokenSecret();
  return jwt.verify(token, secretKey, options) as JWTPayload;
};

/**
 * Verifikasi Refresh Token JWT.
 */
export const verifyRefreshToken = (token: string): JWTPayload => {
  const secretKey = getRefreshTokenSecret();
  return jwt.verify(token, secretKey) as JWTPayload;
};

/**
 * Decode JWT token tanpa melempar error saat kedaluwarsa.
 */
export const decodeJwtToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload | null;
  } catch {
    return null;
  }
};
