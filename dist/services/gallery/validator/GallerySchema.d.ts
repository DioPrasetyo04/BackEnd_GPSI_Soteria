import { z } from "zod";
/**
 * Schema untuk membuat data galeri baru (POST /api/gallery).
 */
export declare const galleryCreateSchema: z.ZodObject<{
    title: z.ZodString;
    category: z.ZodString;
    alt: z.ZodString;
    date: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<Date, string | undefined>>;
    highlight: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>, z.ZodTransform<boolean, string | boolean | undefined>>;
    showInHome: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>, z.ZodTransform<boolean, string | boolean | undefined>>;
}, z.core.$strip>;
/**
 * Schema untuk update galeri (PUT /api/gallery/:id).
 */
export declare const galleryUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    alt: z.ZodOptional<z.ZodString>;
    date: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<Date | undefined, string | undefined>>;
    highlight: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>, z.ZodTransform<boolean | undefined, string | boolean | undefined>>;
    showInHome: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>, z.ZodTransform<boolean | undefined, string | boolean | undefined>>;
}, z.core.$strip>;
export type GalleryCreateInput = z.infer<typeof galleryCreateSchema>;
export type GalleryUpdateInput = z.infer<typeof galleryUpdateSchema>;
//# sourceMappingURL=GallerySchema.d.ts.map