"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wartaUpdateSchema = exports.wartaCreateSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema untuk membuat warta baru (POST /api/warta).
 */
exports.wartaCreateSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, { message: "Judul warta jemaat wajib diisi" })
        .min(3, { message: "Judul warta minimal 3 karakter" })
        .max(150, { message: "Judul warta maksimal 150 karakter" }),
    description: zod_1.z
        .string()
        .min(1, { message: "Deskripsi warta wajib diisi" })
        .min(5, { message: "Deskripsi minimal 5 karakter" }),
    publishedAt: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : new Date())),
    fileUrl: zod_1.z.string().optional(),
});
/**
 * Schema untuk update warta (PUT /api/warta/:slug).
 */
exports.wartaUpdateSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(150).optional(),
    description: zod_1.z.string().min(5).optional(),
    publishedAt: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined)),
    fileUrl: zod_1.z.string().optional(),
});
//# sourceMappingURL=WartaSchema.js.map