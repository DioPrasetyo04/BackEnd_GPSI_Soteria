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

/**
 * Pilihan pengurutan yang didukung untuk modul User Management
 */
export const USER_SORT_OPTIONS = [
  "newest",
  "oldest",
  "name_asc",
  "name_desc",
  "email_asc",
  "email_desc",
] as const;

export type UserSortOptionType = (typeof USER_SORT_OPTIONS)[number];

const sortSchema = z
  .union([z.string(), z.array(z.any())])
  .optional()
  .transform((val, ctx) => {
    if (val === undefined || val === null || val === "") return "newest" as const;
    if (Array.isArray(val) || typeof val !== "string") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parameter sort harus berupa string tunggal",
      });
      return z.NEVER;
    }
    const trimmed = val.trim();
    if (trimmed === "") return "newest" as const;
    if (
      !USER_SORT_OPTIONS.includes(
        trimmed as (typeof USER_SORT_OPTIONS)[number],
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Parameter sort tidak valid. Pilihan yang didukung: ${USER_SORT_OPTIONS.join(", ")}`,
      });
      return z.NEVER;
    }
    return trimmed as (typeof USER_SORT_OPTIONS)[number];
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
    if (val === undefined || val === null || val === "") return 10;
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
 * Schema untuk validasi query parameters pada GET /api/soteria/v1/users.
 */
export const userQuerySchema = z.object({
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
  sort: sortSchema,
  page: pageSchema,
  limit: limitSchema,
});

export type UserQueryInput = z.infer<typeof userQuerySchema>;

