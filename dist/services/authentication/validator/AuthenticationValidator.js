"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processApprovalSchema = exports.resendApprovalSchema = exports.refreshTokenSchema = exports.facebookAuthSchema = exports.googleAuthSchema = exports.authSchema = void 0;
const zod_1 = require("zod");
exports.authSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .min(3, { message: "Nama minimal 3 karakter" })
        .max(100, { message: "Nama maksimal 100 karakter" }),
    email: zod_1.z.string().email({ message: "Format email tidak valid" }),
    password: zod_1.z
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
    role: zod_1.z
        .enum(["ADMIN", "SUPER_ADMIN", "PENGELOLA", "KOORSEK", "PHMJ", "MAJELIS"])
        .optional(),
})
    .strict();
exports.googleAuthSchema = zod_1.z
    .object({
    idToken: zod_1.z.string().min(1, { message: "Google ID Token wajib diisi" }),
})
    .strict();
exports.facebookAuthSchema = zod_1.z
    .object({
    accessToken: zod_1.z
        .string()
        .min(1, { message: "Facebook Access Token wajib diisi" }),
})
    .strict();
exports.refreshTokenSchema = zod_1.z
    .object({
    refreshToken: zod_1.z.string().optional(),
    token: zod_1.z.string().optional(),
})
    .strict();
exports.resendApprovalSchema = zod_1.z
    .object({
    email: zod_1.z.string().email({ message: "Format email tidak valid" }),
})
    .strict();
exports.processApprovalSchema = zod_1.z
    .object({
    token: zod_1.z.string().min(1, { message: "Token verifikasi wajib disertakan" }),
    action: zod_1.z.enum(["approve", "reject"], {
        message: "Aksi harus 'approve' atau 'reject'",
    }),
    reason: zod_1.z.string().optional(),
})
    .strict();
//# sourceMappingURL=AuthenticationValidator.js.map