import multer, { type StorageEngine } from "multer";
import type { Request, Response, NextFunction } from "express";
import path from "node:path";
import fs from "node:fs";
import { InvariantError } from "../exceptions";

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

const dynamicStorage = (): StorageEngine => {
  return multer.diskStorage({
    destination: (req: Request, file, cb) => {
      const typeExt = getFileExt(file);
      let uploadPath: string;

      if (
        (file.fieldname === "images" || file.fieldname === "image") &&
        allowedFileTypesPhoto.includes(typeExt)
      ) {
        uploadPath = path.join("public", "images");
      } else if (
        (file.fieldname === "fileUrl" || file.fieldname === "file") &&
        allowedFileTypesFile.includes(typeExt)
      ) {
        uploadPath = path.join("public", "files");
      } else if (
        (file.fieldname === "video" || file.fieldname === "videos") &&
        allowedFileTypesVideo.includes(typeExt)
      ) {
        uploadPath = path.join("public", "videos");
      } else {
        return cb(
          new InvariantError(
            `Tipe file tidak diizinkan untuk field "${file.fieldname}". ` +
              `Tipe diterima: foto (${allowedFileTypesPhoto.join(",")}), ` +
              `file (${allowedFileTypesFile.join(",")}), ` +
              `video (${allowedFileTypesVideo.join(",")})`,
          ),
          "",
        );
      }

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },

    filename: (req: Request, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const date = new Date();
      const formattedDate = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      const uniqueSuffix = `${formattedDate}-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileName = `${uniqueSuffix}-${file.fieldname}${ext}`;
      cb(null, fileName);
    },
  });
};

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

const uploadDynamicfile = multer({
  storage: dynamicStorage(),
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
});

/**
 * Storage khusus untuk berkas Warta Jemaat (Dokumen atau Gambar)
 */
const wartaStorage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isImage =
      file.mimetype.startsWith("image/") ||
      WARTA_IMAGE_EXTS.includes(ext) ||
      WARTA_IMAGE_MIMES.includes(file.mimetype);

    const uploadPath = isImage
      ? path.join("public", "images")
      : path.join("public", "files");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req: Request, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const date = new Date();
    const formattedDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    const uniqueSuffix = `${formattedDate}-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileName = `${uniqueSuffix}-warta${ext}`;
    cb(null, fileName);
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
 * Multer instance khusus untuk Warta Jemaat.
 * Batas tertinggi Multer adalah 4 MB (mengakomodasi batas dokumen 4 MB).
 */
export const uploadWartaFile = multer({
  storage: wartaStorage,
  fileFilter: wartaFileFilter,
  limits: {
    fileSize: MAX_WARTA_DOC_SIZE, // 4 MB
  },
});

/**
 * Middleware validasi ukuran file Warta:
 * - Gambar maksimal 3 MB
 * - Dokumen maksimal 4 MB
 * Jika melebihi batas, file fisik yang sudah di-upload langsung dihapus untuk mencegah penumpukan di server.
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
    deleteUploadedFile(req.file.path);
    throw new InvariantError(
      `Ukuran file gambar melebihi batas maksimal 3 MB (Ukuran: ${(req.file.size / (1024 * 1024)).toFixed(2)} MB)`,
    );
  }

  if (!isImage && req.file.size > MAX_WARTA_DOC_SIZE) {
    deleteUploadedFile(req.file.path);
    throw new InvariantError(
      `Ukuran file dokumen melebihi batas maksimal 4 MB (Ukuran: ${(req.file.size / (1024 * 1024)).toFixed(2)} MB)`,
    );
  }

  next();
};

/**
 * Menghapus file fisik dari server secara aman.
 */
const deleteUploadedFile = (filePath: string): void => {
  if (!filePath || typeof filePath !== "string") return;
  // Normalisasi leading slash atau backslash (contoh: "/public/files/xxx" -> "public/files/xxx")
  const cleanPath = filePath.replace(/^[/\\]+/, "");
  const fullPath = path.resolve(process.cwd(), cleanPath);
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch (error) {
      console.error(`Gagal menghapus file di storage: ${fullPath}`, error);
    }
  }
};

export {
  uploadDynamicfile,
  allowedFileTypesPhoto,
  allowedFileTypesVideo,
  allowedFileTypesFile,
  deleteUploadedFile,
};
