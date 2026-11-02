"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRenungan = exports.updateRenungan = exports.getRenunganBySlug = exports.getAllRenungan = exports.createRenungan = void 0;
const RenunganRepository_1 = require("../repositories/RenunganRepository");
const RenunganServices_1 = require("../services/RenunganServices");
const response_1 = __importDefault(require("../../../utils/response"));
const multer_1 = require("../../../utils/multer");
// Inisiasi dependency injection
const renunganRepo = new RenunganRepository_1.RenunganRepositories();
const renunganService = new RenunganServices_1.RenunganServices(renunganRepo);
/**
 * Helper: Ambil path image dari req.file atau req.body
 */
const resolveImagePath = (req) => {
    if (req.file) {
        // Normalisasi format path URL publik: /public/images/namafile.ext
        return `/public/images/${req.file.filename}`;
    }
    if (typeof req.body?.image === "string" && req.body.image.trim().length > 0) {
        return req.body.image;
    }
    return undefined;
};
/**
 * POST /api/renungan
 * Buat renungan baru (Mendukung multipart/form-data dengan upload gambar)
 */
const createRenungan = async (req, res, next) => {
    try {
        const imagePath = resolveImagePath(req);
        const renungan = await renunganService.createRenungan({
            ...req.body,
            image: imagePath || "",
        });
        (0, response_1.default)(res, 201, "Data Renungan berhasil dibuat", { renungan });
    }
    catch (error) {
        // Jika proses gagal setelah multer menyimpan file, hapus file baru tersebut agar tidak jadi orphan
        if (req.file) {
            (0, multer_1.deleteUploadedFile)(`/public/images/${req.file.filename}`);
        }
        next(error);
    }
};
exports.createRenungan = createRenungan;
/**
 * GET /api/renungan
 * Ambil semua data renungan
 */
const getAllRenungan = async (req, res, next) => {
    try {
        const renungan = await renunganService.getAllRenungan();
        (0, response_1.default)(res, 200, "Berhasil mengambil data semua renungan", { renungan });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllRenungan = getAllRenungan;
/**
 * GET /api/renungan/:slug
 * Ambil satu renungan berdasarkan slug
 */
const getRenunganBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const renungan = await renunganService.getRenungan(String(slug));
        (0, response_1.default)(res, 200, "Data Renungan berhasil ditemukan", { renungan });
    }
    catch (error) {
        next(error);
    }
};
exports.getRenunganBySlug = getRenunganBySlug;
/**
 * PUT /api/renungan/:slug
 * Update data renungan (Mendukung upload gambar baru)
 */
const updateRenungan = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const newImagePath = resolveImagePath(req);
        const updatePayload = {
            ...req.body,
            ...(newImagePath ? { image: newImagePath } : {}),
        };
        const renungan = await renunganService.updateRenungan(String(slug), updatePayload);
        (0, response_1.default)(res, 200, "Data Renungan berhasil diperbarui", { renungan });
    }
    catch (error) {
        // Hapus file baru jika update gagal
        if (req.file) {
            (0, multer_1.deleteUploadedFile)(`/public/images/${req.file.filename}`);
        }
        next(error);
    }
};
exports.updateRenungan = updateRenungan;
/**
 * DELETE /api/renungan/:slug
 * Hapus data renungan dan file gambarnya
 */
const deleteRenungan = async (req, res, next) => {
    try {
        const { slug } = req.params;
        await renunganService.deleteRenungan(String(slug));
        (0, response_1.default)(res, 200, "Data Renungan berhasil dihapus", null);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteRenungan = deleteRenungan;
//# sourceMappingURL=RenunganController.js.map