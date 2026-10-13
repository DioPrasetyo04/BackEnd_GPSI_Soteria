import { z } from "zod";

/**
 * Schema untuk membuat warta baru (POST /api/warta).
 */
export const wartaCreateSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Judul warta jemaat wajib diisi" })
    .min(3, { message: "Judul warta minimal 3 karakter" })
    .max(150, { message: "Judul warta maksimal 150 karakter" }),
  description: z
    .string()
    .min(1, { message: "Deskripsi warta wajib diisi" })
    .min(5, { message: "Deskripsi minimal 5 karakter" }),
  publishedAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : new Date())),
});

/**
 * Schema untuk update warta (PUT /api/warta/:slug).
 */
export const wartaUpdateSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  description: z.string().min(5).optional(),
  publishedAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});

export type WartaCreateInput = z.infer<typeof wartaCreateSchema>;
export type WartaUpdateInput = z.infer<typeof wartaUpdateSchema>;

/**
 * Schema untuk validasi query parameter pencarian, pengurutan, dan paginasi warta
 * (GET /api/warta).
 */
export const wartaListQuerySchema = z.object({
  q: z
    .string({ message: "Parameter q harus berupa string" })
    .trim()
    .max(100, { message: "Kata kunci pencarian maksimal 100 karakter" })
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),
  sort: z
    .enum(["newest", "oldest", "title_asc", "title_desc"], {
      message:
        "Parameter sort tidak valid. Pilihan: newest, oldest, title_asc, title_desc",
    })
    .default("newest"),
  page: z.coerce
    .number({ message: "Parameter page harus berupa angka" })
    .int({ message: "Parameter page harus berupa bilangan bulat" })
    .min(1, { message: "Parameter page minimal 1" })
    .default(1),
  limit: z.coerce
    .number({ message: "Parameter limit harus berupa angka" })
    .int({ message: "Parameter limit harus berupa bilangan bulat" })
    .min(1, { message: "Parameter limit minimal 1" })
    .max(100, { message: "Parameter limit maksimal 100" })
    .default(10),
});

export type WartaListQueryInput = z.infer<typeof wartaListQuerySchema>;

// Alias agar konsisten dengan konvensi penamaan seperti di Renungan / Jadwal / Gallery
export const wartaQuerySchema = wartaListQuerySchema;
export type WartaQueryInput = WartaListQueryInput;

