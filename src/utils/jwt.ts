import jwt from "jsonwebtoken";
import { expiresInMs } from "./helpers";

export interface JWTPayload {
  data?: {
    id: string;
  };
  id?: string;
  iat?: number;
  exp?: number;
}

export interface GeneratedToken {
  token: string;
  expiresAt: Date;
}

/**
 * Generate a signed JWT token with standard payload contract:
 * { id: userId, data: { id: userId } }
 * and calculate the corresponding expiration date.
 */
export const generateToken = (userId: string): GeneratedToken => {
  const secretKey = (process.env.JWT_SECRET_KEY ?? "secret") as jwt.Secret;
  const expValue = process.env.JWT_EXPIRES_IN ?? "1h";
  const exp = expValue as jwt.SignOptions["expiresIn"];

  const token = jwt.sign(
    {
      id: userId,
      data: { id: userId },
    },
    secretKey,
    { expiresIn: exp },
  );

  const expiresAt = new Date(Date.now() + expiresInMs(expValue));

  return { token, expiresAt };
};

/**
 * Verify JWT signature and decode payload.
 */
export const verifyJwtToken = (token: string): JWTPayload => {
  const secretKey = (process.env.JWT_SECRET_KEY ?? "secret") as jwt.Secret;
  return jwt.verify(token, secretKey) as JWTPayload;
};
