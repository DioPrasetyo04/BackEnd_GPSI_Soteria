import type { Request, Response, NextFunction } from "express";
import { JadwalRepositories } from "../repositories/JadwalRepository";
import { JadwalServices } from "../services/JadwalServices";
import responses from "../../../utils/response";
import type { JadwalQueryInput } from "../validator/JadwalSchema";

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
    const query = (res.locals.validatedQuery || req.query) as unknown as JadwalQueryInput;
    const result = await jadwalService.getAllJadwal(query);
    responses(res, 200, "Data jadwal berhasil diambil", result);
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
