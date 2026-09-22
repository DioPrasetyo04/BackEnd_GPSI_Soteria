import { z } from "zod";

/**
 * Schema password yang kuat:
 * - min 8 karakter
 * - minimal 1 huruf besar, 1 huruf kecil, 1 angka, 1 karakter spesial
 */
const passwordSchema = z
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
  });

const roleEnumSchema = z.enum([
  "ADMIN",
  "SUPER_ADMIN",
  "PENGELOLA",
  "KOORSEK",
  "PHMJ",
  "MAJELIS",
]);

/**
 * Schema untuk membuat user baru (POST).
 * Semua field wajib.
 */
export const userCreateSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .min(3, { message: "Nama minimal 3 karakter" })
    .max(100, { message: "Nama maksimal 100 karakter" }),
  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: passwordSchema,
  role: roleEnumSchema,
});

/**
 * Schema untuk update user (PUT).
 * Semua field opsional — user bisa update sebagian data saja.
 */
export const userUpdateSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Nama minimal 3 karakter" })
    .max(100, { message: "Nama maksimal 100 karakter" })
    .optional(),
  email: z.string().email({ message: "Format email tidak valid" }).optional(),
  password: passwordSchema.optional(),
  role: roleEnumSchema.optional(),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
