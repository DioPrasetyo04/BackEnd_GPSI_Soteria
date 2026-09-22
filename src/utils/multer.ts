import multer, { type StorageEngine } from "multer";
import type { Request } from "express";
import path from "node:path";
import fs from "node:fs";

const allowedFileTypesPhoto = ["png", "jpg", "jpeg", "webp", "gif"];
const allowedFileTypesVideo = ["mp4", "mkv", "avi", "mov", "wmv", "flv", "webm"];
const allowedFileTypesFile = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];

/**
 * Helper — ambil ekstensi dari mimetype string
 * Contoh: "image/jpeg" → "jpeg"
 */
const getMimeExt = (mimetype: string): string => mimetype.split("/")[1] ?? "";

const dynamicStorage = (): StorageEngine => {
  return multer.diskStorage({
    destination: (req: Request, file, cb) => {
      const typeExt = getMimeExt(file.mimetype);
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
          new Error(
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
      const typeExt = getMimeExt(file.mimetype);
      const date = new Date();
      const formattedDate = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      const uniqueSuffix = `${formattedDate}-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileName = `${uniqueSuffix}-${file.fieldname}.${typeExt}`;
      cb(null, fileName);
    },
  });
};

/**
 * File filter — hanya izinkan tipe yang sesuai per field.
 */
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  const typeExt = getMimeExt(file.mimetype);

  if (
    (file.fieldname === "images" || file.fieldname === "image") &&
    !allowedFileTypesPhoto.includes(typeExt)
  ) {
    cb(new Error(`Tipe gambar tidak diizinkan. Diizinkan: ${allowedFileTypesPhoto.join(", ")}`));
  } else if (
    (file.fieldname === "fileUrl" || file.fieldname === "file") &&
    !allowedFileTypesFile.includes(typeExt)
  ) {
    cb(new Error(`Tipe file tidak diizinkan. Diizinkan: ${allowedFileTypesFile.join(", ")}`));
  } else if (
    (file.fieldname === "video" || file.fieldname === "videos") &&
    !allowedFileTypesVideo.includes(typeExt)
  ) {
    cb(new Error(`Tipe video tidak diizinkan. Diizinkan: ${allowedFileTypesVideo.join(", ")}`));
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

const deleteUploadedFile = (filePath: string): void => {
  if (!filePath) return;
  // Normalize leading slash if present (e.g. "/public/images/..." -> "public/images/...")
  const normalized = filePath.startsWith("/") ? filePath.slice(1) : filePath;
  const fullPath = path.resolve(process.cwd(), normalized);
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch (error) {
      throw error;
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
