import type { Request, Response, NextFunction } from "express";
import { WartaRepositories } from "../repositories/WartaRepository";
import { WartaServices } from "../services/WartaServices";
import responses from "../../../utils/response";
import { deleteUploadedFile } from "../../../utils/multer";

const wartaRepo = new WartaRepositories();
const wartaService = new WartaServices(wartaRepo);

const resolveFileUrl = (req: Request): string | undefined => {
  if (req.file) {
    return `/public/files/${req.file.filename}`;
  }
  if (typeof req.body?.fileUrl === "string" && req.body.fileUrl.trim().length > 0) {
    return req.body.fileUrl;
  }
  return undefined;
};

export const createWarta = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const fileUrl = resolveFileUrl(req);

    const warta = await wartaService.createWarta({
      ...req.body,
      fileUrl: fileUrl || "",
    });

    responses(res, 201, "Data warta jemaat berhasil dibuat", { warta });
  } catch (error) {
    if (req.file) {
      deleteUploadedFile(`/public/files/${req.file.filename}`);
    }
    next(error);
  }
};

export const getAllWarta = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const warta = await wartaService.getAllWarta();
    responses(res, 200, "Berhasil mengambil data semua warta", { warta });
  } catch (error) {
    next(error);
  }
};

export const getWartaBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { slug } = req.params;
    const warta = await wartaService.getWarta(String(slug));
    responses(res, 200, "Data warta berhasil ditemukan", { warta });
  } catch (error) {
    next(error);
  }
};

export const updateWarta = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { slug } = req.params;
    const newFileUrl = resolveFileUrl(req);

    const updatePayload = {
      ...req.body,
      ...(newFileUrl ? { fileUrl: newFileUrl } : {}),
    };

    const warta = await wartaService.updateWarta(
      String(slug),
      updatePayload,
    );

    responses(res, 200, "Data warta berhasil diperbarui", { warta });
  } catch (error) {
    if (req.file) {
      deleteUploadedFile(`/public/files/${req.file.filename}`);
    }
    next(error);
  }
};

export const deleteWarta = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { slug } = req.params;
    await wartaService.deleteWarta(String(slug));
    responses(res, 200, "Data warta berhasil dihapus", null);
  } catch (error) {
    next(error);
  }
};
