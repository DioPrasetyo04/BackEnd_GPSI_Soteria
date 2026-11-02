import multer from "multer";
import type { Request, Response, NextFunction } from "express";
declare const allowedFileTypesPhoto: string[];
declare const allowedFileTypesVideo: string[];
declare const allowedFileTypesFile: string[];
export declare const MAX_WARTA_DOC_SIZE: number;
export declare const MAX_WARTA_IMAGE_SIZE: number;
declare const uploadDynamicfile: multer.Multer;
/**
 * Multer instance khusus untuk Warta Jemaat.
 * Batas tertinggi Multer adalah 4 MB (mengakomodasi batas dokumen 4 MB).
 */
export declare const uploadWartaFile: multer.Multer;
/**
 * Middleware validasi ukuran file Warta:
 * - Gambar maksimal 3 MB
 * - Dokumen maksimal 4 MB
 * Jika melebihi batas, file fisik yang sudah di-upload langsung dihapus untuk mencegah penumpukan di server.
 */
export declare const validateWartaFileSize: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Menghapus file fisik dari server secara aman.
 */
declare const deleteUploadedFile: (filePath: string) => void;
export { uploadDynamicfile, allowedFileTypesPhoto, allowedFileTypesVideo, allowedFileTypesFile, deleteUploadedFile, };
//# sourceMappingURL=multer.d.ts.map