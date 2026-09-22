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
