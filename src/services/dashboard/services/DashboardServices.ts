import type { IDashboardRepositories } from "../interfaces/IDashboardRepositories";
import type { DashboardStats } from "../data_interfaces/DashboardInterface";

export class DashboardServices {
  constructor(private readonly dashboardRepo: IDashboardRepositories) {}

  /**
   * Mengambil statistik ringkasan dan kalkulasi count data dari database Supabase
   */
  async getDashboardStatistics(): Promise<DashboardStats> {
    return await this.dashboardRepo.getStatistics();
  }
}
