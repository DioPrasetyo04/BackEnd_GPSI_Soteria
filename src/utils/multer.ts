import multer from "multer";
import type { Request, Response, NextFunction } from "express";
import path from "node:path";
import { InvariantError } from "../exceptions";
import { deleteFromStorage } from "./cloudStorage";

const allowedFileTypesPhoto = ["png", "jpg", "jpeg", "webp", "gif"];
const allowedFileTypesVideo = ["mp4", "mkv", "avi", "mov", "wmv", "flv", "webm"];
const allowedFileTypesFile = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];

// Batas ukuran file khusus Warta Jemaat
export const MAX_WARTA_DOC_SIZE = 4 * 1024 * 1024;   // 4 MB
export const MAX_WARTA_IMAGE_SIZE = 3 * 1024 * 1024; // 3 MB

const WARTA_DOC_MIMES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const WARTA_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const WARTA_DOC_EXTS = [".pdf", ".doc", ".docx"];
const WARTA_IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

/**
 * Helper — ambil ekstensi yang akurat dari nama file atau mimetype
 */
const getFileExt = (file: { originalname: string; mimetype: string }): string => {
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
  if (ext) return ext;
  return file.mimetype.split("/")[1] ?? "";
};

/**
 * Multer in-memory storage:
 * Menghindari error EROFS (Read-only file system) di Vercel / serverless environment
 * karena berkas disimpan sementara di memori sebagai Buffer.
 */
const memoryStorage = multer.memoryStorage();

/**
 * File filter umum — hanya izinkan tipe yang sesuai per field.
 */
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  const typeExt = getFileExt(file);

  if (
    (file.fieldname === "images" || file.fieldname === "image") &&
    !allowedFileTypesPhoto.includes(typeExt)
  ) {
    cb(new InvariantError(`Tipe gambar tidak diizinkan. Diizinkan: ${allowedFileTypesPhoto.join(", ")}`));
  } else if (
    (file.fieldname === "fileUrl" || file.fieldname === "file") &&
    !allowedFileTypesFile.includes(typeExt)
  ) {
    cb(new InvariantError(`Tipe file tidak diizinkan. Diizinkan: ${allowedFileTypesFile.join(", ")}`));
  } else if (
    (file.fieldname === "video" || file.fieldname === "videos") &&
    !allowedFileTypesVideo.includes(typeExt)
  ) {
    cb(new InvariantError(`Tipe video tidak diizinkan. Diizinkan: ${allowedFileTypesVideo.join(", ")}`));
  } else {
    cb(null, true);
  }
};

export const uploadDynamicfile = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
});

/**
 * Filter berkas warta: izinkan Dokumen (.pdf, .doc, .docx) dan Gambar (.jpg, .jpeg, .png, .webp, .gif)
 */
const wartaFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isDoc =
    WARTA_DOC_MIMES.includes(file.mimetype) ||
    WARTA_DOC_EXTS.includes(ext);
  const isImage =
    file.mimetype.startsWith("image/") ||
    WARTA_IMAGE_MIMES.includes(file.mimetype) ||
    WARTA_IMAGE_EXTS.includes(ext);

  if (!isDoc && !isImage) {
    cb(
      new InvariantError(
        "Format file tidak didukung. Diizinkan: Dokumen (PDF, DOC, DOCX) atau Gambar (JPG, JPEG, PNG, WEBP)",
      ),
    );
    return;
  }

  cb(null, true);
};

/**
 * Multer instance khusus untuk Warta Jemaat (In-Memory).
 */
export const uploadWartaFile = multer({
  storage: memoryStorage,
  fileFilter: wartaFileFilter,
  limits: {
    fileSize: MAX_WARTA_DOC_SIZE, // 4 MB
  },
});

/**
 * Middleware validasi ukuran file Warta:
 * - Gambar maksimal 3 MB
 * - Dokumen maksimal 4 MB
 */
export const validateWartaFileSize = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.file) {
    return next();
  }

  const ext = path.extname(req.file.originalname).toLowerCase();
  const isImage =
    req.file.mimetype.startsWith("image/") ||
    WARTA_IMAGE_MIMES.includes(req.file.mimetype) ||
    WARTA_IMAGE_EXTS.includes(ext);

  if (isImage && req.file.size > MAX_WARTA_IMAGE_SIZE) {
    throw new InvariantError(
      `Ukuran file gambar melebihi batas maksimal 3 MB (Ukuran: ${(req.file.size / (1024 * 1024)).toFixed(2)} MB)`,
    );
  }

  if (!isImage && req.file.size > MAX_WARTA_DOC_SIZE) {
    throw new InvariantError(
      `Ukuran file dokumen melebihi batas maksimal 4 MB (Ukuran: ${(req.file.size / (1024 * 1024)).toFixed(2)} MB)`,
    );
  }

  next();
};

/**
 * Helper kompatibel untuk menghapus file fisik / storage secara aman.
 */
export const deleteUploadedFile = (filePath?: string): void => {
  if (!filePath || typeof filePath !== "string") return;
  deleteFromStorage(filePath, "warta").catch((err) => {
    console.error("Gagal menghapus berkas:", err);
  });
};

export {
  allowedFileTypesPhoto,
  allowedFileTypesVideo,
  allowedFileTypesFile,
};
