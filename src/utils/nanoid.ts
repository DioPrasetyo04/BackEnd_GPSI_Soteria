import crypto from "node:crypto";

/**
 * Pengganti native nanoid menggunakan node:crypto bawaan.
 * Menghasilkan string acak URL-safe (A-Za-z0-9_-) yang 100% kompatibel
 * dengan CommonJS dan ES Modules tanpa external dependency ESM.
 */
export const nanoid = (size = 21): string => {
  return crypto
    .randomBytes(Math.ceil(size * 0.75))
    .toString("base64url")
    .slice(0, size);
};

export default nanoid;
