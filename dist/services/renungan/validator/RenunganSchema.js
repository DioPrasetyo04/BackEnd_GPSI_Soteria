"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renunganUpdateSchema = exports.renunganCreateSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema untuk membuat renungan baru (POST /api/renungan).
 * Field teks dikirim via multipart/form-data atau JSON.
 */
exports.renunganCreateSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, { message: "Judul renungan wajib diisi" })
        .min(3, { message: "Judul renungan minimal 3 karakter" })
        .max(200, { message: "Judul renungan maksimal 200 karakter" }),
    excerpt: zod_1.z
        .string()
        .min(1, { message: "Ringkasan (excerpt) renungan wajib diisi" })
        .min(3, { message: "Ringkasan renungan minimal 3 karakter" }),
    description: zod_1.z
        .string()
        .min(1, { message: "Deskripsi renungan wajib diisi" })
        .min(10, { message: "Deskripsi renungan minimal 10 karakter" }),
    author: zod_1.z
        .string()
        .min(1, { message: "Nama penulis (author) wajib diisi" })
        .min(2, { message: "Nama penulis minimal 2 karakter" })
        .max(100, { message: "Nama penulis maksimal 100 karakter" }),
    category: zod_1.z
        .string()
        .min(1)
        .max(50)
        .optional()
        .default("Renungan"),
    publishedAt: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : new Date())),
}).strict();
/**
 * Schema untuk update renungan (PUT /api/renungan/:slug).
 * Semua field teks bersifat opsional.
 */
exports.renunganUpdateSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3, { message: "Judul renungan minimal 3 karakter" })
        .max(200, { message: "Judul renungan maksimal 200 karakter" })
        .optional(),
    excerpt: zod_1.z
        .string()
        .min(3, { message: "Ringkasan renungan minimal 3 karakter" })
        .optional(),
    description: zod_1.z
        .string()
        .min(10, { message: "Deskripsi renungan minimal 10 karakter" })
        .optional(),
    author: zod_1.z
        .string()
        .min(2, { message: "Nama penulis minimal 2 karakter" })
        .max(100, { message: "Nama penulis maksimal 100 karakter" })
        .optional(),
    category: zod_1.z
        .string()
        .max(50)
        .optional(),
    publishedAt: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined)),
}).strict();
//# sourceMappingURL=RenunganSchema.js.map