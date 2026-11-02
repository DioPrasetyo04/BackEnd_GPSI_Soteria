"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardServices = void 0;
class DashboardServices {
    dashboardRepo;
    constructor(dashboardRepo) {
        this.dashboardRepo = dashboardRepo;
    }
    /**
     * Mengambil statistik ringkasan dan kalkulasi count data dari database Supabase
     */
    async getDashboardStatistics() {
        return await this.dashboardRepo.getStatistics();
    }
}
exports.DashboardServices = DashboardServices;
//# sourceMappingURL=DashboardServices.js.map