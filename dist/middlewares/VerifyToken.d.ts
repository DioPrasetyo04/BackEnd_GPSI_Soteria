import type { Response, NextFunction } from "express";
import type { CustomRequest, Role } from "../types/Request";
export declare const verifyToken: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
/**
 * Memverifikasi apakah user memiliki peran tunggal tertentu.
 * Mendukung multiple roles pada akun pengguna (user.roles).
 */
export declare const verifyRole: (type: Role) => (req: CustomRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
/**
 * Helper fleksibel multi-role:
 * Memverifikasi apakah user memiliki SALAH SATU dari peran yang diizinkan.
 * Mendukung pemanggilan spread arguments `verifyRoles("ADMIN", "SUPER_ADMIN")`
 * maupun array argument `verifyRoles(["ADMIN", "SUPER_ADMIN"])`.
 * Memeriksa `user.roles` (multiple roles) dan `user.role` (primary role).
 */
export declare const verifyRoles: (...types: (Role | Role[])[]) => (req: CustomRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
/**
 * Memverifikasi apakah user memiliki perizinan (permissions) yang dibutuhkan.
 * Mendukung pemanggilan spread arguments maupun array `verifyPermissions("users.view", "users.manage")`.
 * SUPER_ADMIN atau pemegang wildcard "*" otomatis lolos.
 */
export declare const verifyPermissions: (...permissions: (string | string[])[]) => (req: CustomRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export interface MultiAuthOptions {
    roles?: Role | Role[];
    permissions?: string | string[];
}
/**
 * Helper otorisasi gabungan:
 * Lolos jika user memenuhi SALAH SATU kriteria: memiliki role yang diizinkan ATAU memiliki permission yang disyaratkan.
 */
export declare const verifyRoleOrPermission: (options: MultiAuthOptions) => (req: CustomRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=VerifyToken.d.ts.map