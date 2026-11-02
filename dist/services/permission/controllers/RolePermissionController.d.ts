import type { Request, Response, NextFunction } from "express";
/**
 * GET /api/soteria/v1/roles-permissions/meta
 * Mengambil metadata definisi modul dan perizinan sistem
 */
export declare const getPermissionsMeta: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /api/soteria/v1/roles-permissions/matrix
 * Mengambil seluruh perizinan yang dikonfigurasi per role
 */
export declare const getAllRolePermissions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * PUT /api/soteria/v1/roles-permissions/:role
 * Menyimpan / memperbarui daftar izin untuk sebuah role
 */
export declare const updateRolePermission: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /api/soteria/v1/roles-permissions/users/:id
 * Mengambil perizinan dan multiple roles seorang user
 */
export declare const getUserPermissions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * PUT /api/soteria/v1/roles-permissions/users/:id
 * Mengubah multiple roles dan perizinan kustom seorang user
 */
export declare const updateUserPermissions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=RolePermissionController.d.ts.map