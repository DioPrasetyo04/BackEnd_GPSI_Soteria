import { z } from "zod";
/**
 * Schema untuk membuat warta baru (POST /api/warta).
 */
export declare const wartaCreateSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    publishedAt: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<Date, string | undefined>>;
}, z.core.$strip>;
/**
 * Schema untuk update warta (PUT /api/warta/:slug).
 */
export declare const wartaUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    publishedAt: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<Date | undefined, string | undefined>>;
}, z.core.$strip>;
export type WartaCreateInput = z.infer<typeof wartaCreateSchema>;
export type WartaUpdateInput = z.infer<typeof wartaUpdateSchema>;
//# sourceMappingURL=WartaSchema.d.ts.map