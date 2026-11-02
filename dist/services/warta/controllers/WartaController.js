"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWarta = exports.updateWarta = exports.getWartaBySlug = exports.getAllWarta = exports.createWarta = void 0;
const WartaRepository_1 = require("../repositories/WartaRepository");
const WartaServices_1 = require("../services/WartaServices");
const response_1 = __importDefault(require("../../../utils/response"));
const multer_1 = require("../../../utils/multer");
const wartaRepo = new WartaRepository_1.WartaRepositories();
const wartaService = new WartaServices_1.WartaServices(wartaRepo);
const resolveFileUrl = (req) => {
    if (req.file) {
        const relativePath = req.file.path.replace(/\\/g, "/");
        return relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
    }
    if (typeof req.body?.fileUrl === "string" && req.body.fileUrl.trim().length > 0) {
        return req.body.fileUrl;
    }
    return undefined;
};
const createWarta = async (req, res, next) => {
    try {
        const fileUrl = resolveFileUrl(req);
        const warta = await wartaService.createWarta({
            ...req.body,
            fileUrl: fileUrl || "",
        });
        (0, response_1.default)(res, 201, "Data warta jemaat berhasil dibuat", { warta });
    }
    catch (error) {
        if (req.file) {
            (0, multer_1.deleteUploadedFile)(req.file.path);
        }
        next(error);
    }
};
exports.createWarta = createWarta;
const getAllWarta = async (req, res, next) => {
    try {
        const warta = await wartaService.getAllWarta();
        (0, response_1.default)(res, 200, "Berhasil mengambil data semua warta", { warta });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllWarta = getAllWarta;
const getWartaBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const warta = await wartaService.getWarta(String(slug));
        (0, response_1.default)(res, 200, "Data warta berhasil ditemukan", { warta });
    }
    catch (error) {
        next(error);
    }
};
exports.getWartaBySlug = getWartaBySlug;
const updateWarta = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const newFileUrl = resolveFileUrl(req);
        const updatePayload = {
            ...req.body,
            ...(newFileUrl ? { fileUrl: newFileUrl } : {}),
        };
        const warta = await wartaService.updateWarta(String(slug), updatePayload);
        (0, response_1.default)(res, 200, "Data warta berhasil diperbarui", { warta });
    }
    catch (error) {
        if (req.file) {
            (0, multer_1.deleteUploadedFile)(req.file.path);
        }
        next(error);
    }
};
exports.updateWarta = updateWarta;
const deleteWarta = async (req, res, next) => {
    try {
        const { slug } = req.params;
        await wartaService.deleteWarta(String(slug));
        (0, response_1.default)(res, 200, "Data warta berhasil dihapus", null);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteWarta = deleteWarta;
//# sourceMappingURL=WartaController.js.map