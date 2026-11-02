"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWarta = exports.updateWarta = exports.getWartaBySlug = exports.getAllWarta = exports.createWarta = void 0;
const WartaRepository_1 = require("../repositories/WartaRepository");
const WartaServices_1 = require("../services/WartaServices");
const response_1 = __importDefault(require("../../../utils/response"));
const cloudStorage_1 = require("../../../utils/cloudStorage");
const wartaRepo = new WartaRepository_1.WartaRepositories();
const wartaService = new WartaServices_1.WartaServices(wartaRepo);
const createWarta = async (req, res, next) => {
    try {
        let fileUrl;
        if (req.file) {
            fileUrl = await (0, cloudStorage_1.uploadToStorage)(req.file, {
                bucket: "warta",
                folder: "files",
            });
        }
        else if (typeof req.body?.fileUrl === "string" &&
            req.body.fileUrl.trim().length > 0) {
            fileUrl = req.body.fileUrl;
        }
        const warta = await wartaService.createWarta({
            ...req.body,
            fileUrl: fileUrl || "",
        });
        (0, response_1.default)(res, 201, "Data warta jemaat berhasil dibuat", { warta });
    }
    catch (error) {
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
        let newFileUrl;
        if (req.file) {
            newFileUrl = await (0, cloudStorage_1.uploadToStorage)(req.file, {
                bucket: "warta",
                folder: "files",
            });
        }
        else if (typeof req.body?.fileUrl === "string" &&
            req.body.fileUrl.trim().length > 0) {
            newFileUrl = req.body.fileUrl;
        }
        const updatePayload = {
            ...req.body,
            ...(newFileUrl ? { fileUrl: newFileUrl } : {}),
        };
        const warta = await wartaService.updateWarta(String(slug), updatePayload);
        (0, response_1.default)(res, 200, "Data warta berhasil diperbarui", { warta });
    }
    catch (error) {
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