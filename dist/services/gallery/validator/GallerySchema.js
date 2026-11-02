"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleryUpdateSchema = exports.galleryCreateSchema = void 0;
const zod_1 = require("zod");
const parseBoolean = (val, defaultValue = false) => {
    if (typeof val === "boolean")
        return val;
    if (typeof val === "string") {
        const lower = val.trim().toLowerCase();
        return lower === "true" || lower === "1";
    }
    return defaultValue;
};
/**
 * Schema untuk membuat data galeri baru (POST /api/gallery).
 */
exports.galleryCreateSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, { message: "Judul foto galeri wajib diisi" })
        .min(3, { message: "Judul foto minimal 3 karakter" })
        .max(150, { message: "Judul foto maksimal 150 karakter" }),
    category: zod_1.z
        .string()
        .min(1, { message: "Kategori galeri wajib diisi" })
        .max(50, { message: "Kategori maksimal 50 karakter" }),
    alt: zod_1.z
        .string()
        .min(1, { message: "Teks alternatif (alt) wajib diisi" })
        .max(200, { message: "Teks alternatif maksimal 200 karakter" }),
    date: zod_1.z
        .string()
        .optional()
        .transform((val, ctx) => {
        if (!val)
            return new Date();
        const d = new Date(val);
        if (isNaN(d.getTime())) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "Format tanggal tidak valid",
            });
            return zod_1.z.NEVER;
        }
        return d;
    }),
    highlight: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.string()])
        .optional()
        .transform((val) => parseBoolean(val, false)),
    showInHome: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.string()])
        .optional()
        .transform((val) => parseBoolean(val, false)),
});
/**
 * Schema untuk update galeri (PUT /api/gallery/:id).
 */
exports.galleryUpdateSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(150).optional(),
    category: zod_1.z.string().min(1).max(50).optional(),
    alt: zod_1.z.string().min(1).max(200).optional(),
    date: zod_1.z
        .string()
        .optional()
        .transform((val, ctx) => {
        if (!val)
            return undefined;
        const d = new Date(val);
        if (isNaN(d.getTime())) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "Format tanggal tidak valid",
            });
            return zod_1.z.NEVER;
        }
        return d;
    }),
    highlight: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.string()])
        .optional()
        .transform((val) => (val !== undefined ? parseBoolean(val) : undefined)),
    showInHome: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.string()])
        .optional()
        .transform((val) => (val !== undefined ? parseBoolean(val) : undefined)),
});
//# sourceMappingURL=GallerySchema.js.map