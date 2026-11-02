"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJadwal = exports.updateJadwal = exports.getJadwalById = exports.getAllJadwal = exports.createJadwal = void 0;
const JadwalRepository_1 = require("../repositories/JadwalRepository");
const JadwalServices_1 = require("../services/JadwalServices");
const response_1 = __importDefault(require("../../../utils/response"));
const jadwalRepo = new JadwalRepository_1.JadwalRepositories();
const jadwalService = new JadwalServices_1.JadwalServices(jadwalRepo);
const createJadwal = async (req, res, next) => {
    try {
        const jadwal = await jadwalService.createJadwal(req.body);
        (0, response_1.default)(res, 201, "Jadwal berhasil dibuat", { jadwal });
    }
    catch (error) {
        next(error);
    }
};
exports.createJadwal = createJadwal;
const getAllJadwal = async (req, res, next) => {
    try {
        const jadwal = await jadwalService.getAllJadwal();
        (0, response_1.default)(res, 200, "Berhasil mengambil semua data jadwal", { jadwal });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllJadwal = getAllJadwal;
const getJadwalById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const jadwal = await jadwalService.getJadwalById(String(id));
        (0, response_1.default)(res, 200, "Data jadwal ditemukan", { jadwal });
    }
    catch (error) {
        next(error);
    }
};
exports.getJadwalById = getJadwalById;
const updateJadwal = async (req, res, next) => {
    try {
        const { id } = req.params;
        const jadwal = await jadwalService.updateJadwal(String(id), req.body);
        (0, response_1.default)(res, 200, "Data jadwal berhasil diperbarui", { jadwal });
    }
    catch (error) {
        next(error);
    }
};
exports.updateJadwal = updateJadwal;
const deleteJadwal = async (req, res, next) => {
    try {
        const { id } = req.params;
        await jadwalService.deleteJadwal(String(id));
        (0, response_1.default)(res, 200, "Data jadwal berhasil dihapus", null);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteJadwal = deleteJadwal;
//# sourceMappingURL=JadwalController.js.map