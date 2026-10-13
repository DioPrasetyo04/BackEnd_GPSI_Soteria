import { z } from "zod";

/**
 * Schema untuk membuat renungan baru (POST /api/renungan).
 * Field teks dikirim via multipart/form-data atau JSON.
 */
export const renunganCreateSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Judul renungan wajib diisi" })
    .min(3, { message: "Judul renungan minimal 3 karakter" })
    .max(200, { message: "Judul renungan maksimal 200 karakter" }),
  excerpt: z
    .string()
    .min(1, { message: "Ringkasan (excerpt) renungan wajib diisi" })
    .min(3, { message: "Ringkasan renungan minimal 3 karakter" }),
  description: z
    .string()
    .min(1, { message: "Deskripsi renungan wajib diisi" })
    .min(10, { message: "Deskripsi renungan minimal 10 karakter" }),
  author: z
    .string()
    .min(1, { message: "Nama penulis (author) wajib diisi" })
    .min(2, { message: "Nama penulis minimal 2 karakter" })
    .max(100, { message: "Nama penulis maksimal 100 karakter" }),
  category: z
    .string()
    .min(1)
    .max(50)
    .optional()
    .default("Renungan"),
  publishedAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : new Date())),
}).strict();

/**
 * Schema untuk update renungan (PUT /api/renungan/:slug).
 * Semua field teks bersifat opsional.
 */
export const renunganUpdateSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Judul renungan minimal 3 karakter" })
    .max(200, { message: "Judul renungan maksimal 200 karakter" })
    .optional(),
  excerpt: z
    .string()
    .min(3, { message: "Ringkasan renungan minimal 3 karakter" })
    .optional(),
  description: z
    .string()
    .min(10, { message: "Deskripsi renungan minimal 10 karakter" })
    .optional(),
  author: z
    .string()
    .min(2, { message: "Nama penulis minimal 2 karakter" })
    .max(100, { message: "Nama penulis maksimal 100 karakter" })
    .optional(),
  category: z
    .string()
    .max(50)
    .optional(),
  publishedAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
}).strict();

export type RenunganCreateInput = z.infer<typeof renunganCreateSchema>;
export type RenunganUpdateInput = z.infer<typeof renunganUpdateSchema>;

/**
 * Schema untuk validasi query parameter pencarian, pengurutan, dan paginasi renungan
 * (GET /api/renungan).
 */
export const renunganListQuerySchema = z.object({
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

export type RenunganListQueryInput = z.infer<typeof renunganListQuerySchema>;

// Alias agar konsisten dengan konvensi penamaan seperti di JadwalSchema
export const renunganQuerySchema = renunganListQuerySchema;
export type RenunganQueryInput = RenunganListQueryInput;
