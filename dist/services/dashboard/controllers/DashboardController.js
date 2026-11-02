"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const DashboardRepository_1 = require("../repositories/DashboardRepository");
const DashboardServices_1 = require("../services/DashboardServices");
const response_1 = __importDefault(require("../../../utils/response"));
const dashboardRepo = new DashboardRepository_1.DashboardRepository();
const dashboardService = new DashboardServices_1.DashboardServices(dashboardRepo);
/**
 * GET /api/soteria/v1/dashboard/stats
 * Mengembalikan kalkulasi jumlah count seluruh modul data di database Supabase
 */
const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await dashboardService.getDashboardStatistics();
        (0, response_1.default)(res, 200, "Berhasil mengambil statistik dashboard", stats);
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=DashboardController.js.map