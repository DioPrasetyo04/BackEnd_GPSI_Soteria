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

/**
 * Pilihan pengurutan yang didukung untuk modul Jadwal
 */
export const JADWAL_SORT_OPTIONS = [
  "upcoming",
  "latest",
  "activity_asc",
  "activity_desc",
] as const;

export type JadwalSortOptionType = (typeof JADWAL_SORT_OPTIONS)[number];

/**
 * Helper validasi tanggal kalender riil format YYYY-MM-DD.
 * Memastikan tidak ada tanggal mustahil (misal 30 Februari, 31 April, dsb.)
 */
export const isValidCalendarDate = (dateStr: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
};

const dateStringSchema = (paramName: string) =>
  z
    .union([z.string(), z.array(z.any())])
    .optional()
    .transform((val, ctx) => {
      if (val === undefined || val === null || val === "") return undefined;
      if (Array.isArray(val) || typeof val !== "string") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Parameter ${paramName} harus berupa string tanggal tunggal`,
        });
        return z.NEVER;
      }
      const trimmed = val.trim();
      if (trimmed === "") return undefined;
      if (!isValidCalendarDate(trimmed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${paramName} harus berupa tanggal kalender yang valid dengan format YYYY-MM-DD`,
        });
        return z.NEVER;
      }
      return trimmed;
    });

const sortSchema = z
  .union([z.string(), z.array(z.any())])
  .optional()
  .transform((val, ctx) => {
    if (val === undefined || val === null || val === "") return "upcoming" as const;
    if (Array.isArray(val) || typeof val !== "string") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parameter sort harus berupa string tunggal",
      });
      return z.NEVER;
    }
    const trimmed = val.trim();
    if (trimmed === "") return "upcoming" as const;
    if (!JADWAL_SORT_OPTIONS.includes(trimmed as (typeof JADWAL_SORT_OPTIONS)[number])) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Parameter sort tidak valid. Pilihan yang didukung: ${JADWAL_SORT_OPTIONS.join(", ")}`,
      });
      return z.NEVER;
    }
    return trimmed as (typeof JADWAL_SORT_OPTIONS)[number];
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
          message: "Parameter page harus berupa bilangan bulat positif (minimal 1)",
        });
        return z.NEVER;
      }
      return val;
    }
    const trimmed = val.trim();
    if (!/^[1-9]\d*$/.test(trimmed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parameter page harus berupa bilangan bulat positif (minimal 1)",
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
          message: "Parameter limit harus berupa bilangan bulat positif antara 1 dan 100",
        });
        return z.NEVER;
      }
      return val;
    }
    const trimmed = val.trim();
    if (!/^[1-9]\d*$/.test(trimmed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parameter limit harus berupa bilangan bulat positif antara 1 dan 100",
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
 * Schema untuk validasi query parameters pada GET /api/soteria/v1/jadwal.
 */
export const jadwalQuerySchema = z
  .object({
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
    dateFrom: dateStringSchema("dateFrom"),
    dateTo: dateStringSchema("dateTo"),
    sort: sortSchema,
    page: pageSchema,
    limit: limitSchema,
  })
  .superRefine((data, ctx) => {
    if (data.dateFrom && data.dateTo) {
      if (data.dateFrom > data.dateTo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "dateFrom tidak boleh lebih besar dari dateTo",
          path: ["dateFrom"],
        });
      }
    }
  });

export type JadwalQueryInput = z.infer<typeof jadwalQuerySchema>;
