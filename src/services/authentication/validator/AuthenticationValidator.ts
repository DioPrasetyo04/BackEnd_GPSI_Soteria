
import { z } from "zod";

export const authSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Nama minimal 3 karakter" })
      .max(100, { message: "Nama maksimal 100 karakter" }),
    email: z.string().email({ message: "Format email tidak valid" }),
    password: z
      .string()
      .min(8, { message: "Password minimal 8 karakter" })
      .regex(/[A-Z]/, {
        message: "Password harus mengandung minimal 1 huruf besar",
      })
      .regex(/[a-z]/, {
        message: "Password harus mengandung minimal 1 huruf kecil",
      })
      .regex(/[0-9]/, { message: "Password harus mengandung minimal 1 angka" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password harus mengandung minimal 1 karakter spesial",
      }),
    role: z
      .enum(["ADMIN", "SUPER_ADMIN", "PENGELOLA", "KOORSEK", "PHMJ", "MAJELIS"])
      .optional(),
  })
  .strict();

export const googleAuthSchema = z
  .object({
    idToken: z.string().min(1, { message: "Google ID Token wajib diisi" }),
  })
  .strict();

export const facebookAuthSchema = z
  .object({
    accessToken: z
      .string()
      .min(1, { message: "Facebook Access Token wajib diisi" }),
  })
  .strict();

export const refreshTokenSchema = z
  .object({
    refreshToken: z.string().optional(),
    token: z.string().optional(),
  })
  .strict();

export const resendApprovalSchema = z
  .object({
    email: z.string().email({ message: "Format email tidak valid" }),
  })
  .strict();

export const processApprovalSchema = z
  .object({
    token: z.string().min(1, { message: "Token verifikasi wajib disertakan" }),
    action: z.enum(["approve", "reject"], {
      message: "Aksi harus 'approve' atau 'reject'",
    }),
    reason: z.string().optional(),
  })
  .strict();



