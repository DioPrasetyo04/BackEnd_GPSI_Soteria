import { z } from "zod";
export declare const roleEnumSchema: z.ZodEnum<{
    ADMIN: "ADMIN";
    SUPER_ADMIN: "SUPER_ADMIN";
    PENGELOLA: "PENGELOLA";
    KOORSEK: "KOORSEK";
    PHMJ: "PHMJ";
    MAJELIS: "MAJELIS";
}>;
/**
 * Schema untuk membuat user baru (POST).
 */
export declare const userCreateSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        SUPER_ADMIN: "SUPER_ADMIN";
        PENGELOLA: "PENGELOLA";
        KOORSEK: "KOORSEK";
        PHMJ: "PHMJ";
        MAJELIS: "MAJELIS";
    }>>;
    roles: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        ADMIN: "ADMIN";
        SUPER_ADMIN: "SUPER_ADMIN";
        PENGELOLA: "PENGELOLA";
        KOORSEK: "KOORSEK";
        PHMJ: "PHMJ";
        MAJELIS: "MAJELIS";
    }>>>;
    customPermissions: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
/**
 * Schema untuk update user (PUT).
 */
export declare const userUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        SUPER_ADMIN: "SUPER_ADMIN";
        PENGELOLA: "PENGELOLA";
        KOORSEK: "KOORSEK";
        PHMJ: "PHMJ";
        MAJELIS: "MAJELIS";
    }>>;
    roles: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        ADMIN: "ADMIN";
        SUPER_ADMIN: "SUPER_ADMIN";
        PENGELOLA: "PENGELOLA";
        KOORSEK: "KOORSEK";
        PHMJ: "PHMJ";
        MAJELIS: "MAJELIS";
    }>>>;
    customPermissions: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
//# sourceMappingURL=userSchema.d.ts.map