import { z } from "zod";
export declare const organizationCategoryEnum: z.ZodEnum<{
    PENGURUS_HARIAN: "PENGURUS_HARIAN";
    KOORDINATOR_SEKTOR: "KOORDINATOR_SEKTOR";
}>;
/**
 * Schema untuk membuat data pengurus/organisasi baru (POST /api/organization).
 */
export declare const organizationCreateSchema: z.ZodObject<{
    category: z.ZodEnum<{
        PENGURUS_HARIAN: "PENGURUS_HARIAN";
        KOORDINATOR_SEKTOR: "KOORDINATOR_SEKTOR";
    }>;
    position: z.ZodString;
    name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    fax: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    order: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>, z.ZodTransform<number, string | number | undefined>>;
    isActive: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>, z.ZodTransform<boolean, string | boolean | undefined>>;
}, z.core.$strip>;
/**
 * Schema untuk update data organisasi (PUT /api/organization/:id).
 */
export declare const organizationUpdateSchema: z.ZodObject<{
    category: z.ZodOptional<z.ZodEnum<{
        PENGURUS_HARIAN: "PENGURUS_HARIAN";
        KOORDINATOR_SEKTOR: "KOORDINATOR_SEKTOR";
    }>>;
    position: z.ZodOptional<z.ZodString>;
    name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    fax: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    order: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>, z.ZodTransform<number | undefined, string | number | undefined>>;
    isActive: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>, z.ZodTransform<boolean | undefined, string | boolean | undefined>>;
}, z.core.$strip>;
export type OrganizationCreateInput = z.infer<typeof organizationCreateSchema>;
export type OrganizationUpdateInput = z.infer<typeof organizationUpdateSchema>;
//# sourceMappingURL=OrganizationSchema.d.ts.map