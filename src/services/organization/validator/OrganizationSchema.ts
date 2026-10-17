import { z } from "zod";

const parseBoolean = (val: unknown, defaultValue = true): boolean => {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    const lower = val.trim().toLowerCase();
    return lower === "true" || lower === "1";
  }
  return defaultValue;
};

export const organizationCategoryEnum = z.enum([
  "PENGURUS_HARIAN",
  "KOORDINATOR_SEKTOR",
]);

/**
 * Schema untuk membuat data pengurus/organisasi baru (POST /api/organization).
 */
export const organizationCreateSchema = z.object({
  category: organizationCategoryEnum,
  position: z
    .string()
    .min(1, { message: "Jabatan (position) wajib diisi" })
    .min(2, { message: "Jabatan minimal 2 karakter" })
    .max(100, { message: "Jabatan maksimal 100 karakter" }),
  name: z.string().max(100).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  fax: z.string().max(30).optional().nullable(),
  order: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : 0)),
  isActive: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => parseBoolean(val, true)),
});

/**
 * Schema untuk update data organisasi (PUT /api/organization/:id).
 */
export const organizationUpdateSchema = z.object({
  category: organizationCategoryEnum.optional(),
  position: z.string().min(2).max(100).optional(),
  name: z.string().max(100).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  fax: z.string().max(30).optional().nullable(),
  order: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined)),
  isActive: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => (val !== undefined ? parseBoolean(val) : undefined)),
});

export type OrganizationCreateInput = z.infer<typeof organizationCreateSchema>;
export type OrganizationUpdateInput = z.infer<typeof organizationUpdateSchema>;
