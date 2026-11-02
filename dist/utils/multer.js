"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUploadedFile = exports.allowedFileTypesFile = exports.allowedFileTypesVideo = exports.allowedFileTypesPhoto = exports.uploadDynamicfile = exports.validateWartaFileSize = exports.uploadWartaFile = exports.MAX_WARTA_IMAGE_SIZE = exports.MAX_WARTA_DOC_SIZE = void 0;
const multer_1 = __importDefault(require("multer"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const exceptions_1 = require("../exceptions");
const allowedFileTypesPhoto = ["png", "jpg", "jpeg", "webp", "gif"];
exports.allowedFileTypesPhoto = allowedFileTypesPhoto;
const allowedFileTypesVideo = ["mp4", "mkv", "avi", "mov", "wmv", "flv", "webm"];
exports.allowedFileTypesVideo = allowedFileTypesVideo;
const allowedFileTypesFile = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];
exports.allowedFileTypesFile = allowedFileTypesFile;
// Batas ukuran file khusus Warta Jemaat
exports.MAX_WARTA_DOC_SIZE = 4 * 1024 * 1024; // 4 MB
exports.MAX_WARTA_IMAGE_SIZE = 3 * 1024 * 1024; // 3 MB
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
const getFileExt = (file) => {
    const ext = node_path_1.default.extname(file.originalname).toLowerCase().replace(".", "");
    if (ext)
        return ext;
    return file.mimetype.split("/")[1] ?? "";
};
const dynamicStorage = () => {
    return multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const typeExt = getFileExt(file);
            let uploadPath;
            if ((file.fieldname === "images" || file.fieldname === "image") &&
                allowedFileTypesPhoto.includes(typeExt)) {
                uploadPath = node_path_1.default.join("public", "images");
            }
            else if ((file.fieldname === "fileUrl" || file.fieldname === "file") &&
                allowedFileTypesFile.includes(typeExt)) {
                uploadPath = node_path_1.default.join("public", "files");
            }
            else if ((file.fieldname === "video" || file.fieldname === "videos") &&
                allowedFileTypesVideo.includes(typeExt)) {
                uploadPath = node_path_1.default.join("public", "videos");
            }
            else {
                return cb(new exceptions_1.InvariantError(`Tipe file tidak diizinkan untuk field "${file.fieldname}". ` +
                    `Tipe diterima: foto (${allowedFileTypesPhoto.join(",")}), ` +
                    `file (${allowedFileTypesFile.join(",")}), ` +
                    `video (${allowedFileTypesVideo.join(",")})`), "");
            }
            if (!node_fs_1.default.existsSync(uploadPath)) {
                node_fs_1.default.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const ext = node_path_1.default.extname(file.originalname).toLowerCase();
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
const fileFilter = (req, file, cb) => {
    const typeExt = getFileExt(file);
    if ((file.fieldname === "images" || file.fieldname === "image") &&
        !allowedFileTypesPhoto.includes(typeExt)) {
        cb(new exceptions_1.InvariantError(`Tipe gambar tidak diizinkan. Diizinkan: ${allowedFileTypesPhoto.join(", ")}`));
    }
    else if ((file.fieldname === "fileUrl" || file.fieldname === "file") &&
        !allowedFileTypesFile.includes(typeExt)) {
        cb(new exceptions_1.InvariantError(`Tipe file tidak diizinkan. Diizinkan: ${allowedFileTypesFile.join(", ")}`));
    }
    else if ((file.fieldname === "video" || file.fieldname === "videos") &&
        !allowedFileTypesVideo.includes(typeExt)) {
        cb(new exceptions_1.InvariantError(`Tipe video tidak diizinkan. Diizinkan: ${allowedFileTypesVideo.join(", ")}`));
    }
    else {
        cb(null, true);
    }
};
const uploadDynamicfile = (0, multer_1.default)({
    storage: dynamicStorage(),
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB max
    },
});
exports.uploadDynamicfile = uploadDynamicfile;
/**
 * Storage khusus untuk berkas Warta Jemaat (Dokumen atau Gambar)
 */
const wartaStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const ext = node_path_1.default.extname(file.originalname).toLowerCase();
        const isImage = file.mimetype.startsWith("image/") ||
            WARTA_IMAGE_EXTS.includes(ext) ||
            WARTA_IMAGE_MIMES.includes(file.mimetype);
        const uploadPath = isImage
            ? node_path_1.default.join("public", "images")
            : node_path_1.default.join("public", "files");
        if (!node_fs_1.default.existsSync(uploadPath)) {
            node_fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = node_path_1.default.extname(file.originalname).toLowerCase();
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
const wartaFileFilter = (req, file, cb) => {
    const ext = node_path_1.default.extname(file.originalname).toLowerCase();
    const isDoc = WARTA_DOC_MIMES.includes(file.mimetype) ||
        WARTA_DOC_EXTS.includes(ext);
    const isImage = file.mimetype.startsWith("image/") ||
        WARTA_IMAGE_MIMES.includes(file.mimetype) ||
        WARTA_IMAGE_EXTS.includes(ext);
    if (!isDoc && !isImage) {
        cb(new exceptions_1.InvariantError("Format file tidak didukung. Diizinkan: Dokumen (PDF, DOC, DOCX) atau Gambar (JPG, JPEG, PNG, WEBP)"));
        return;
    }
    cb(null, true);
};
/**
 * Multer instance khusus untuk Warta Jemaat.
 * Batas tertinggi Multer adalah 4 MB (mengakomodasi batas dokumen 4 MB).
 */
exports.uploadWartaFile = (0, multer_1.default)({
    storage: wartaStorage,
    fileFilter: wartaFileFilter,
    limits: {
        fileSize: exports.MAX_WARTA_DOC_SIZE, // 4 MB
    },
});
/**
 * Middleware validasi ukuran file Warta:
 * - Gambar maksimal 3 MB
 * - Dokumen maksimal 4 MB
 * Jika melebihi batas, file fisik yang sudah di-upload langsung dihapus untuk mencegah penumpukan di server.
 */
const validateWartaFileSize = (req, res, next) => {
    if (!req.file) {
        return next();
    }
    const ext = node_path_1.default.extname(req.file.originalname).toLowerCase();
    const isImage = req.file.mimetype.startsWith("image/") ||
        WARTA_IMAGE_MIMES.includes(req.file.mimetype) ||
        WARTA_IMAGE_EXTS.includes(ext);
    if (isImage && req.file.size > exports.MAX_WARTA_IMAGE_SIZE) {
        deleteUploadedFile(req.file.path);
        throw new exceptions_1.InvariantError(`Ukuran file gambar melebihi batas maksimal 3 MB (Ukuran: ${(req.file.size / (1024 * 1024)).toFixed(2)} MB)`);
    }
    if (!isImage && req.file.size > exports.MAX_WARTA_DOC_SIZE) {
        deleteUploadedFile(req.file.path);
        throw new exceptions_1.InvariantError(`Ukuran file dokumen melebihi batas maksimal 4 MB (Ukuran: ${(req.file.size / (1024 * 1024)).toFixed(2)} MB)`);
    }
    next();
};
exports.validateWartaFileSize = validateWartaFileSize;
/**
 * Menghapus file fisik dari server secara aman.
 */
const deleteUploadedFile = (filePath) => {
    if (!filePath || typeof filePath !== "string")
        return;
    // Normalisasi leading slash atau backslash (contoh: "/public/files/xxx" -> "public/files/xxx")
    const cleanPath = filePath.replace(/^[/\\]+/, "");
    const fullPath = node_path_1.default.resolve(process.cwd(), cleanPath);
    if (node_fs_1.default.existsSync(fullPath)) {
        try {
            node_fs_1.default.unlinkSync(fullPath);
        }
        catch (error) {
            console.error(`Gagal menghapus file di storage: ${fullPath}`, error);
        }
    }
};
exports.deleteUploadedFile = deleteUploadedFile;
//# sourceMappingURL=multer.js.map