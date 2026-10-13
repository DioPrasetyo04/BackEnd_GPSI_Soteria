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

/**
 * Pilihan pengurutan yang didukung untuk modul Organisasi
 */
export const ORGANIZATION_SORT_OPTIONS = [
  "default",
  "order_asc",
  "order_desc",
  "name_asc",
  "name_desc",
  "newest",
  "oldest",
] as const;

export type OrganizationSortOptionType =
  (typeof ORGANIZATION_SORT_OPTIONS)[number];

const sortSchema = z
  .union([z.string(), z.array(z.any())])
  .optional()
  .transform((val, ctx) => {
    if (val === undefined || val === null || val === "")
      return "default" as const;
    if (Array.isArray(val) || typeof val !== "string") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parameter sort harus berupa string tunggal",
      });
      return z.NEVER;
    }
    const trimmed = val.trim();
    if (
      !ORGANIZATION_SORT_OPTIONS.includes(
        trimmed as (typeof ORGANIZATION_SORT_OPTIONS)[number],
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Parameter sort tidak valid. Pilihan yang didukung: ${ORGANIZATION_SORT_OPTIONS.join(", ")}`,
      });
      return z.NEVER;
    }
    return trimmed as (typeof ORGANIZATION_SORT_OPTIONS)[number];
  });

const categoryQuerySchema = z
  .union([z.string(), z.array(z.any())])
  .optional()
  .transform((val, ctx) => {
    if (val === undefined || val === null || val === "") return undefined;
    if (Array.isArray(val) || typeof val !== "string") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parameter category harus berupa string tunggal",
      });
      return z.NEVER;
    }
    const trimmed = val.trim();
    if (trimmed === "") return undefined;
    if (
      trimmed !== "PENGURUS_HARIAN" &&
      trimmed !== "KOORDINATOR_SEKTOR"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Parameter category tidak valid. Pilihan yang didukung: PENGURUS_HARIAN, KOORDINATOR_SEKTOR",
      });
      return z.NEVER;
    }
    return trimmed as "PENGURUS_HARIAN" | "KOORDINATOR_SEKTOR";
  });

const pageSchema = z
  .union([z.string(), z.number(), z.array(z.any())])
  .optional()
  .transform((val, ctx) => {
    if (val === undefined || val === null || val === "") return 1;
    if (Array.isArray(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parameter page tidak boleh duplikat atau berupa array",
      });
      return z.NEVER;
    }
    if (typeof val === "number") {
      if (!Number.isInteger(val) || val < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Parameter page harus berupa bilangan bulat positif (minimal 1)",
        });
        return z.NEVER;
      }
      return val;
    }
    const trimmed = val.trim();
    if (!/^[1-9]\d*$/.test(trimmed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Parameter page harus berupa bilangan bulat positif (minimal 1)",
      });
      return z.NEVER;
    }
    return Number(trimmed);
  });

const limitSchema = z
  .union([z.string(), z.number(), z.array(z.any())])
  .optional()
  .transform((val, ctx) => {
    if (val === undefined || val === null || val === "") return 9;
    if (Array.isArray(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parameter limit tidak boleh duplikat atau berupa array",
      });
      return z.NEVER;
    }
    if (typeof val === "number") {
      if (!Number.isInteger(val) || val < 1 || val > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Parameter limit harus berupa bilangan bulat positif antara 1 dan 100",
        });
        return z.NEVER;
      }
      return val;
    }
    const trimmed = val.trim();
    if (!/^[1-9]\d*$/.test(trimmed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Parameter limit harus berupa bilangan bulat positif antara 1 dan 100",
      });
      return z.NEVER;
    }
    const parsed = Number(trimmed);
    if (parsed > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parameter limit maksimal bernilai 100",
      });
      return z.NEVER;
    }
    return parsed;
  });

/**
 * Schema untuk validasi query parameters pada GET /api/soteria/v1/organization.
 */
export const organizationListQuerySchema = z.object({
  q: z
    .union([z.string(), z.array(z.any())])
    .optional()
    .transform((val, ctx) => {
      if (val === undefined || val === null || val === "") return undefined;
      if (Array.isArray(val) || typeof val !== "string") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Parameter q harus berupa string tunggal",
        });
        return z.NEVER;
      }
      const trimmed = val.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    }),
  category: categoryQuerySchema,
  sort: sortSchema,
  page: pageSchema,
  limit: limitSchema,
});

export type OrganizationQueryInput = z.infer<
  typeof organizationListQuerySchema
>;

