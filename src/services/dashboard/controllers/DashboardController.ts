import type { Request, Response, NextFunction } from "express";
import { DashboardRepository } from "../repositories/DashboardRepository";
import { DashboardServices } from "../services/DashboardServices";
import responses from "../../../utils/response";

const dashboardRepo = new DashboardRepository();
const dashboardService = new DashboardServices(dashboardRepo);

/**
 * GET /api/soteria/v1/dashboard/stats
 * Mengembalikan kalkulasi jumlah count seluruh modul data di database Supabase
 */
export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const stats = await dashboardService.getDashboardStatistics();
    responses(res, 200, "Berhasil mengambil statistik dashboard", stats);
  } catch (error) {
    next(error);
  }
};
