"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRenungan = exports.updateRenungan = exports.getRenunganBySlug = exports.getAllRenungan = exports.createRenungan = void 0;
const RenunganRepository_1 = require("../repositories/RenunganRepository");
const RenunganServices_1 = require("../services/RenunganServices");
const response_1 = __importDefault(require("../../../utils/response"));
const cloudStorage_1 = require("../../../utils/cloudStorage");
const renunganRepo = new RenunganRepository_1.RenunganRepositories();
const renunganService = new RenunganServices_1.RenunganServices(renunganRepo);
const createRenungan = async (req, res, next) => {
    try {
        let imagePath;
        if (req.file) {
            imagePath = await (0, cloudStorage_1.uploadToStorage)(req.file, {
                bucket: "renungan",
                folder: "images",
            });
        }
        else if (typeof req.body?.image === "string" &&
            req.body.image.trim().length > 0) {
            imagePath = req.body.image;
        }
        const renungan = await renunganService.createRenungan({
            ...req.body,
            image: imagePath || "",
        });
        (0, response_1.default)(res, 201, "Data Renungan berhasil dibuat", { renungan });
    }
    catch (error) {
        next(error);
    }
};
exports.createRenungan = createRenungan;
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
const updateRenungan = async (req, res, next) => {
    try {
        const { slug } = req.params;
        let newImagePath;
        if (req.file) {
            newImagePath = await (0, cloudStorage_1.uploadToStorage)(req.file, {
                bucket: "renungan",
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
        const renungan = await renunganService.updateRenungan(String(slug), updatePayload);
        (0, response_1.default)(res, 200, "Data Renungan berhasil diperbarui", { renungan });
    }
    catch (error) {
        next(error);
    }
};
exports.updateRenungan = updateRenungan;
const deleteRenungan = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const existing = await renunganService.getRenungan(String(slug));
        if (existing?.image) {
            await (0, cloudStorage_1.deleteFromStorage)(existing.image, "renungan");
        }
        await renunganService.deleteRenungan(String(slug));
        (0, response_1.default)(res, 200, "Data Renungan berhasil dihapus", null);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteRenungan = deleteRenungan;
//# sourceMappingURL=RenunganController.js.map