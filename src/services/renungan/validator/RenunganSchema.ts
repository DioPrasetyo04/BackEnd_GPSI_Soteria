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
