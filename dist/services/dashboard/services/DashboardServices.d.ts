import type { IDashboardRepositories } from "../interfaces/IDashboardRepositories";
import type { DashboardStats } from "../data_interfaces/DashboardInterface";
export declare class DashboardServices {
    private readonly dashboardRepo;
    constructor(dashboardRepo: IDashboardRepositories);
    /**
     * Mengambil statistik ringkasan dan kalkulasi count data dari database Supabase
     */
    getDashboardStatistics(): Promise<DashboardStats>;
}
//# sourceMappingURL=DashboardServices.d.ts.map