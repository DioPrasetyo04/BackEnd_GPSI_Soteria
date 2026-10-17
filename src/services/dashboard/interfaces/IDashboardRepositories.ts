import type { DashboardStats } from "../data_interfaces/DashboardInterface";

export interface IDashboardRepositories {
  getStatistics(): Promise<DashboardStats>;
  countJadwal(filter?: { upcomingOnly?: boolean }): Promise<number>;
  countRenungan(): Promise<number>;
  countWarta(): Promise<number>;
  countGallery(filter?: { highlightedOnly?: boolean }): Promise<number>;
  countOrganization(filter?: { category?: "PENGURUS_HARIAN" | "KOORDINATOR_SEKTOR" }): Promise<number>;
  countUsers(filter?: { status?: "PENDING" | "APPROVED" | "REJECTED" }): Promise<number>;
}
