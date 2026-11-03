"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGallery = exports.updateGallery = exports.getGalleryById = exports.getHomeGallery = exports.getAllGallery = exports.createGallery = void 0;
const GalleryRepository_1 = require("../repositories/GalleryRepository");
const GalleryServices_1 = require("../services/GalleryServices");
const response_1 = __importDefault(require("../../../utils/response"));
const cloudStorage_1 = require("../../../utils/cloudStorage");
const galleryRepo = new GalleryRepository_1.GalleryRepositories();
const galleryService = new GalleryServices_1.GalleryServices(galleryRepo);
const createGallery = async (req, res, next) => {
    try {
        let imagePath;
        if (req.file) {
            imagePath = await (0, cloudStorage_1.uploadToStorage)(req.file, {
                bucket: "gallery",
                folder: "images",
            });
        }
        else if (typeof req.body?.image === "string" &&
            req.body.image.trim().length > 0) {
            imagePath = req.body.image;
        }
        const gallery = await galleryService.createGallery({
            ...req.body,
            image: imagePath || "",
        });
        (0, response_1.default)(res, 201, "Data galeri berhasil ditambahkan", { gallery });
    }
    catch (error) {
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
const getHomeGallery = async (req, res, next) => {
    try {
        const rawLimit = req.query.limit;
        const parsed = typeof rawLimit === "string" ? Number.parseInt(rawLimit, 10) : NaN;
        const limit = Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
        const gallery = await galleryService.getHomeGallery(limit);
        (0, response_1.default)(res, 200, "Berhasil mengambil galeri beranda", { gallery });
    }
    catch (error) {
        next(error);
    }
};
exports.getHomeGallery = getHomeGallery;
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
        let newImagePath;
        if (req.file) {
            newImagePath = await (0, cloudStorage_1.uploadToStorage)(req.file, {
                bucket: "gallery",
                folder: "images",
            });
        }
        else if (typeof req.body?.image === "string" &&
            req.body.image.trim().length > 0) {
            newImagePath = req.body.image;
        }
        const updatePayload = {
            ...req.body,
            ...(newImagePath ? { image: newImagePath } : {}),
        };
        const gallery = await galleryService.updateGallery(String(id), updatePayload);
        (0, response_1.default)(res, 200, "Data galeri berhasil diperbarui", { gallery });
    }
    catch (error) {
        next(error);
    }
};
exports.updateGallery = updateGallery;
const deleteGallery = async (req, res, next) => {
    try {
        const { id } = req.params;
        const existing = await galleryService.getGalleryById(String(id));
        if (existing?.image) {
            await (0, cloudStorage_1.deleteFromStorage)(existing.image, "gallery");
        }
        await galleryService.deleteGallery(String(id));
        (0, response_1.default)(res, 200, "Data galeri berhasil dihapus", null);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteGallery = deleteGallery;
//# sourceMappingURL=GalleryController.js.map