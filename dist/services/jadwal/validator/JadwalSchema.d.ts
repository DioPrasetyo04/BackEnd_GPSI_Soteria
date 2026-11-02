import { z } from "zod";
/**
 * Schema untuk membuat jadwal baru (POST /api/jadwal).
 */
export declare const jadwalCreateSchema: z.ZodObject<{
    date: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
    time: z.ZodString;
    activity: z.ZodString;
    organizer: z.ZodString;
    location: z.ZodString;
    description: z.ZodString;
}, z.core.$strip>;
/**
 * Schema untuk update jadwal (PUT /api/jadwal/:id).
 */
export declare const jadwalUpdateSchema: z.ZodObject<{
    date: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<Date | undefined, string | undefined>>;
    time: z.ZodOptional<z.ZodString>;
    activity: z.ZodOptional<z.ZodString>;
    organizer: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type JadwalCreateInput = z.infer<typeof jadwalCreateSchema>;
export type JadwalUpdateInput = z.infer<typeof jadwalUpdateSchema>;
//# sourceMappingURL=JadwalSchema.d.ts.map