import type { Request, Response, NextFunction } from "express";
/**
 * POST /api/renungan
 * Buat renungan baru (Mendukung multipart/form-data dengan upload gambar)
 */
export declare const createRenungan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /api/renungan
 * Ambil semua data renungan
 */
export declare const getAllRenungan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * GET /api/renungan/:slug
 * Ambil satu renungan berdasarkan slug
 */
export declare const getRenunganBySlug: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * PUT /api/renungan/:slug
 * Update data renungan (Mendukung upload gambar baru)
 */
export declare const updateRenungan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * DELETE /api/renungan/:slug
 * Hapus data renungan dan file gambarnya
 */
export declare const deleteRenungan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=RenunganController.d.ts.map