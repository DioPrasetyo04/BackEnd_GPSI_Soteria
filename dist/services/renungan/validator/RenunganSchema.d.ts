import { z } from "zod";
/**
 * Schema untuk membuat renungan baru (POST /api/renungan).
 * Field teks dikirim via multipart/form-data atau JSON.
 */
export declare const renunganCreateSchema: z.ZodObject<{
    title: z.ZodString;
    excerpt: z.ZodString;
    description: z.ZodString;
    author: z.ZodString;
    category: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    publishedAt: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<Date, string | undefined>>;
}, z.core.$strict>;
/**
 * Schema untuk update renungan (PUT /api/renungan/:slug).
 * Semua field teks bersifat opsional.
 */
export declare const renunganUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    publishedAt: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<Date | undefined, string | undefined>>;
}, z.core.$strict>;
export type RenunganCreateInput = z.infer<typeof renunganCreateSchema>;
export type RenunganUpdateInput = z.infer<typeof renunganUpdateSchema>;
//# sourceMappingURL=RenunganSchema.d.ts.map