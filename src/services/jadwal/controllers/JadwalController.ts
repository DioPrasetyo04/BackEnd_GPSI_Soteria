import type { Request, Response, NextFunction } from "express";
import { JadwalRepositories } from "../repositories/JadwalRepository";
import { JadwalServices } from "../services/JadwalServices";
import responses from "../../../utils/response";

const jadwalRepo = new JadwalRepositories();
const jadwalService = new JadwalServices(jadwalRepo);

export const createJadwal = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const jadwal = await jadwalService.createJadwal(req.body);
    responses(res, 201, "Jadwal berhasil dibuat", { jadwal });
  } catch (error) {
    next(error);
  }
};

export const getAllJadwal = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const jadwal = await jadwalService.getAllJadwal();
    responses(res, 200, "Berhasil mengambil semua data jadwal", { jadwal });
  } catch (error) {
    next(error);
  }
};

export const getJadwalById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const jadwal = await jadwalService.getJadwalById(String(id));
    responses(res, 200, "Data jadwal ditemukan", { jadwal });
  } catch (error) {
    next(error);
  }
};

export const updateJadwal = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const jadwal = await jadwalService.updateJadwal(String(id), req.body);
    responses(res, 200, "Data jadwal berhasil diperbarui", { jadwal });
  } catch (error) {
    next(error);
  }
};

export const deleteJadwal = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    await jadwalService.deleteJadwal(String(id));
    responses(res, 200, "Data jadwal berhasil dihapus", null);
  } catch (error) {
    next(error);
  }
};
