import { z } from "zod";

/**
 * Schema untuk membuat jadwal baru (POST /api/jadwal).
 */
export const jadwalCreateSchema = z.object({
  date: z
    .string()
    .min(1, { message: "Tanggal kegiatan wajib diisi" })
    .transform((val, ctx) => {
      const parsedDate = new Date(val);
      if (isNaN(parsedDate.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Format tanggal tidak valid (gunakan format YYYY-MM-DD atau ISO string)",
        });
        return z.NEVER;
      }
      return parsedDate;
    }),
  time: z
    .string()
    .min(1, { message: "Waktu kegiatan wajib diisi" })
    .max(50, { message: "Waktu maksimal 50 karakter" }),
  activity: z
    .string()
    .min(1, { message: "Nama kegiatan (activity) wajib diisi" })
    .min(3, { message: "Nama kegiatan minimal 3 karakter" })
    .max(100, { message: "Nama kegiatan maksimal 100 karakter" }),
  organizer: z
    .string()
    .min(1, { message: "Penyelenggara (organizer) wajib diisi" })
    .min(2, { message: "Penyelenggara minimal 2 karakter" })
    .max(100, { message: "Penyelenggara maksimal 100 karakter" }),
  location: z
    .string()
    .min(1, { message: "Lokasi kegiatan wajib diisi" })
    .min(2, { message: "Lokasi minimal 2 karakter" })
    .max(150, { message: "Lokasi maksimal 150 karakter" }),
  description: z
    .string()
    .min(1, { message: "Deskripsi kegiatan wajib diisi" })
    .min(5, { message: "Deskripsi minimal 5 karakter" }),
});

/**
 * Schema untuk update jadwal (PUT /api/jadwal/:id).
 */
export const jadwalUpdateSchema = z.object({
  date: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (!val) return undefined;
      const parsedDate = new Date(val);
      if (isNaN(parsedDate.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Format tanggal tidak valid",
        });
        return z.NEVER;
      }
      return parsedDate;
    }),
  time: z.string().min(1).max(50).optional(),
  activity: z.string().min(3).max(100).optional(),
  organizer: z.string().min(2).max(100).optional(),
  location: z.string().min(2).max(150).optional(),
  description: z.string().min(5).optional(),
});

export type JadwalCreateInput = z.infer<typeof jadwalCreateSchema>;
export type JadwalUpdateInput = z.infer<typeof jadwalUpdateSchema>;
