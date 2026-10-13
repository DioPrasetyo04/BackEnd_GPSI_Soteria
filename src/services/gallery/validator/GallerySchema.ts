import { z } from "zod";

const parseBoolean = (val: unknown, defaultValue = false): boolean => {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    const lower = val.trim().toLowerCase();
    return lower === "true" || lower === "1";
  }
  return defaultValue;
};

/**
 * Schema untuk membuat data galeri baru (POST /api/gallery).
 */
export const galleryCreateSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Judul foto galeri wajib diisi" })
    .min(3, { message: "Judul foto minimal 3 karakter" })
    .max(150, { message: "Judul foto maksimal 150 karakter" }),
  category: z
    .string()
    .min(1, { message: "Kategori galeri wajib diisi" })
    .max(50, { message: "Kategori maksimal 50 karakter" }),
  alt: z
    .string()
    .min(1, { message: "Teks alternatif (alt) wajib diisi" })
    .max(200, { message: "Teks alternatif maksimal 200 karakter" }),
  date: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (!val) return new Date();
      const d = new Date(val);
      if (isNaN(d.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Format tanggal tidak valid",
        });
        return z.NEVER;
      }
      return d;
    }),
  highlight: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => parseBoolean(val, false)),
  showInHome: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => parseBoolean(val, false)),
});

/**
 * Schema untuk update galeri (PUT /api/gallery/:id).
 */
export const galleryUpdateSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  category: z.string().min(1).max(50).optional(),
  alt: z.string().min(1).max(200).optional(),
  date: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (!val) return undefined;
      const d = new Date(val);
      if (isNaN(d.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Format tanggal tidak valid",
        });
        return z.NEVER;
      }
      return d;
    }),
  highlight: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => (val !== undefined ? parseBoolean(val) : undefined)),
  showInHome: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => (val !== undefined ? parseBoolean(val) : undefined)),
});

export type GalleryCreateInput = z.infer<typeof galleryCreateSchema>;
export type GalleryUpdateInput = z.infer<typeof galleryUpdateSchema>;

/**
 * Pilihan pengurutan yang didukung untuk modul Galeri
 */
export const GALLERY_SORT_OPTIONS = [
  "newest",
  "oldest",
  "title_asc",
  "title_desc",
] as const;

export type GallerySortOptionType = (typeof GALLERY_SORT_OPTIONS)[number];

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
    if (
      !GALLERY_SORT_OPTIONS.includes(
        trimmed as (typeof GALLERY_SORT_OPTIONS)[number],
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Parameter sort tidak valid. Pilihan yang didukung: ${GALLERY_SORT_OPTIONS.join(", ")}`,
      });
      return z.NEVER;
    }
    return trimmed as (typeof GALLERY_SORT_OPTIONS)[number];
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
 * Schema untuk validasi query parameters pada GET /api/soteria/v1/galeri (atau /api/soteria/v1/gallery).
 */
export const galleryQuerySchema = z.object({
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
  category: z
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
      return trimmed.length > 0 ? trimmed : undefined;
    }),
  sort: sortSchema,
  page: pageSchema,
  limit: limitSchema,
});

export type GalleryQueryInput = z.infer<typeof galleryQuerySchema>;
