"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateSchema = exports.userCreateSchema = exports.roleEnumSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema password yang kuat:
 * - min 8 karakter
 * - minimal 1 huruf besar, 1 huruf kecil, 1 angka, 1 karakter spesial
 */
const passwordSchema = zod_1.z
    .string()
    .min(8, { message: "Password minimal 8 karakter" })
    .regex(/[A-Z]/, { message: "Password harus mengandung minimal 1 huruf besar" })
    .regex(/[a-z]/, { message: "Password harus mengandung minimal 1 huruf kecil" })
    .regex(/[0-9]/, { message: "Password harus mengandung minimal 1 angka" })
    .regex(/[^A-Za-z0-9]/, {
    message: "Password harus mengandung minimal 1 karakter spesial",
});
exports.roleEnumSchema = zod_1.z.enum([
    "ADMIN",
    "SUPER_ADMIN",
    "PENGELOLA",
    "KOORSEK",
    "PHMJ",
    "MAJELIS",
]);
/**
 * Schema untuk membuat user baru (POST).
 */
exports.userCreateSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, { message: "Nama wajib diisi" })
        .min(3, { message: "Nama minimal 3 karakter" })
        .max(100, { message: "Nama maksimal 100 karakter" }),
    email: zod_1.z
        .string()
        .min(1, { message: "Email wajib diisi" })
        .email({ message: "Format email tidak valid" }),
    password: passwordSchema,
    role: exports.roleEnumSchema.optional(),
    roles: zod_1.z.array(exports.roleEnumSchema).optional(),
    customPermissions: zod_1.z.array(zod_1.z.string()).optional(),
});
/**
 * Schema untuk update user (PUT).
 */
exports.userUpdateSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, { message: "Nama minimal 3 karakter" })
        .max(100, { message: "Nama maksimal 100 karakter" })
        .optional(),
    email: zod_1.z
        .string()
        .email({ message: "Format email tidak valid" })
        .optional(),
    password: passwordSchema.optional(),
    role: exports.roleEnumSchema.optional(),
    roles: zod_1.z.array(exports.roleEnumSchema).optional(),
    customPermissions: zod_1.z.array(zod_1.z.string()).optional(),
});
//# sourceMappingURL=userSchema.js.map