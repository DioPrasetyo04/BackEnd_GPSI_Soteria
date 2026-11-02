import { z } from "zod";
export declare const authSchema: z.ZodObject<{
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
}, z.core.$strict>;
export declare const googleAuthSchema: z.ZodObject<{
    idToken: z.ZodString;
}, z.core.$strict>;
export declare const facebookAuthSchema: z.ZodObject<{
    accessToken: z.ZodString;
}, z.core.$strict>;
export declare const refreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodOptional<z.ZodString>;
    token: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const resendApprovalSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strict>;
export declare const processApprovalSchema: z.ZodObject<{
    token: z.ZodString;
    action: z.ZodEnum<{
        approve: "approve";
        reject: "reject";
    }>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
//# sourceMappingURL=AuthenticationValidator.d.ts.map