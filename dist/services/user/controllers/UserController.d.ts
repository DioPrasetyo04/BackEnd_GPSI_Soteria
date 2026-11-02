import type { Request, Response, NextFunction } from "express";
/**
 * POST /api/users
 * Buat user baru
 */
export declare const createUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /api/users
 * Ambil semua user dengan filter query (search, sort, pagination)
 */
export declare const getAllUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /api/users/:id
 * Ambil satu user berdasarkan ID
 */
export declare const getUserById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * PUT /api/users/:id
 * Update data user
 */
export declare const updateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * DELETE /api/users/:id
 * Hapus user berdasarkan ID
 */
export declare const deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=UserController.d.ts.map