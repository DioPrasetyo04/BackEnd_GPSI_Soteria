import type { IDashboardRepositories } from "../interfaces/IDashboardRepositories";
import type { DashboardStats } from "../data_interfaces/DashboardInterface";
export declare class DashboardRepository implements IDashboardRepositories {
    countJadwal(filter?: {
        upcomingOnly?: boolean;
    }): Promise<number>;
    countRenungan(): Promise<number>;
    countWarta(): Promise<number>;
    countGallery(filter?: {
        highlightedOnly?: boolean;
    }): Promise<number>;
    countOrganization(filter?: {
        category?: "PENGURUS_HARIAN" | "KOORDINATOR_SEKTOR";
    }): Promise<number>;
    countUsers(filter?: {
        status?: "PENDING" | "APPROVED" | "REJECTED";
    }): Promise<number>;
    getStatistics(): Promise<DashboardStats>;
}
//# sourceMappingURL=DashboardRepository.d.ts.map