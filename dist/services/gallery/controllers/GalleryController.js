"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGallery = exports.updateGallery = exports.getGalleryById = exports.getAllGallery = exports.createGallery = void 0;
const GalleryRepository_1 = require("../repositories/GalleryRepository");
const GalleryServices_1 = require("../services/GalleryServices");
const response_1 = __importDefault(require("../../../utils/response"));
const multer_1 = require("../../../utils/multer");
const galleryRepo = new GalleryRepository_1.GalleryRepositories();
const galleryService = new GalleryServices_1.GalleryServices(galleryRepo);
const resolveImagePath = (req) => {
    if (req.file) {
        return `/public/images/${req.file.filename}`;
    }
    if (typeof req.body?.image === "string" && req.body.image.trim().length > 0) {
        return req.body.image;
    }
    return undefined;
};
const createGallery = async (req, res, next) => {
    try {
        const imagePath = resolveImagePath(req);
        const gallery = await galleryService.createGallery({
            ...req.body,
            image: imagePath || "",
        });
        (0, response_1.default)(res, 201, "Data galeri berhasil ditambahkan", { gallery });
    }
    catch (error) {
        if (req.file) {
            (0, multer_1.deleteUploadedFile)(`/public/images/${req.file.filename}`);
        }
        next(error);
    }
};
exports.createGallery = createGallery;
const getAllGallery = async (req, res, next) => {
    try {
        const gallery = await galleryService.getAllGallery();
        (0, response_1.default)(res, 200, "Berhasil mengambil data semua galeri", { gallery });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllGallery = getAllGallery;
const getGalleryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const gallery = await galleryService.getGalleryById(String(id));
        (0, response_1.default)(res, 200, "Data galeri ditemukan", { gallery });
    }
    catch (error) {
        next(error);
    }
};
exports.getGalleryById = getGalleryById;
const updateGallery = async (req, res, next) => {
    try {
        const { id } = req.params;
        const newImagePath = resolveImagePath(req);
        const updatePayload = {
            ...req.body,
            ...(newImagePath ? { image: newImagePath } : {}),
        };
        const gallery = await galleryService.updateGallery(String(id), updatePayload);
        (0, response_1.default)(res, 200, "Data galeri berhasil diperbarui", { gallery });
    }
    catch (error) {
        if (req.file) {
            (0, multer_1.deleteUploadedFile)(`/public/images/${req.file.filename}`);
        }
        next(error);
    }
};
exports.updateGallery = updateGallery;
const deleteGallery = async (req, res, next) => {
    try {
        const { id } = req.params;
        await galleryService.deleteGallery(String(id));
        (0, response_1.default)(res, 200, "Data galeri berhasil dihapus", null);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteGallery = deleteGallery;
//# sourceMappingURL=GalleryController.js.map