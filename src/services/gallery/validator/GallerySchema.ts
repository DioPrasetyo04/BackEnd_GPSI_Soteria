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
