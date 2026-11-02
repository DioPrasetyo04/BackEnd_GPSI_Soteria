"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationUpdateSchema = exports.organizationCreateSchema = exports.organizationCategoryEnum = void 0;
const zod_1 = require("zod");
const parseBoolean = (val, defaultValue = true) => {
    if (typeof val === "boolean")
        return val;
    if (typeof val === "string") {
        const lower = val.trim().toLowerCase();
        return lower === "true" || lower === "1";
    }
    return defaultValue;
};
exports.organizationCategoryEnum = zod_1.z.enum([
    "PENGURUS_HARIAN",
    "KOORDINATOR_SEKTOR",
]);
/**
 * Schema untuk membuat data pengurus/organisasi baru (POST /api/organization).
 */
exports.organizationCreateSchema = zod_1.z.object({
    category: exports.organizationCategoryEnum,
    position: zod_1.z
        .string()
        .min(1, { message: "Jabatan (position) wajib diisi" })
        .min(2, { message: "Jabatan minimal 2 karakter" })
        .max(100, { message: "Jabatan maksimal 100 karakter" }),
    name: zod_1.z.string().max(100).optional().nullable(),
    phone: zod_1.z.string().max(30).optional().nullable(),
    fax: zod_1.z.string().max(30).optional().nullable(),
    order: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .optional()
        .transform((val) => (val !== undefined ? Number(val) : 0)),
    isActive: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.string()])
        .optional()
        .transform((val) => parseBoolean(val, true)),
});
/**
 * Schema untuk update data organisasi (PUT /api/organization/:id).
 */
exports.organizationUpdateSchema = zod_1.z.object({
    category: exports.organizationCategoryEnum.optional(),
    position: zod_1.z.string().min(2).max(100).optional(),
    name: zod_1.z.string().max(100).optional().nullable(),
    phone: zod_1.z.string().max(30).optional().nullable(),
    fax: zod_1.z.string().max(30).optional().nullable(),
    order: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .optional()
        .transform((val) => (val !== undefined ? Number(val) : undefined)),
    isActive: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.string()])
        .optional()
        .transform((val) => (val !== undefined ? parseBoolean(val) : undefined)),
});
//# sourceMappingURL=OrganizationSchema.js.map