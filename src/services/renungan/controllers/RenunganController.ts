import type { Request, Response, NextFunction } from "express";
import { RenunganRepositories } from "../repositories/RenunganRepository";
import { RenunganServices } from "../services/RenunganServices";
import responses from "../../../utils/response";
import { deleteUploadedFile } from "../../../utils/multer";

// Inisiasi dependency injection
const renunganRepo = new RenunganRepositories();
const renunganService = new RenunganServices(renunganRepo);

/**
 * Helper: Ambil path image dari req.file atau req.body
 */
const resolveImagePath = (req: Request): string | undefined => {
  if (req.file) {
    // Normalisasi format path URL publik: /public/images/namafile.ext
    return `/public/images/${req.file.filename}`;
  }
  if (typeof req.body?.image === "string" && req.body.image.trim().length > 0) {
    return req.body.image;
  }
  return undefined;
};

/**
 * POST /api/renungan
 * Buat renungan baru (Mendukung multipart/form-data dengan upload gambar)
 */
export const createRenungan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const imagePath = resolveImagePath(req);

    const renungan = await renunganService.createRenungan({
      ...req.body,
      image: imagePath || "",
    });

    responses(res, 201, "Data Renungan berhasil dibuat", { renungan });
  } catch (error) {
    // Jika proses gagal setelah multer menyimpan file, hapus file baru tersebut agar tidak jadi orphan
    if (req.file) {
      deleteUploadedFile(`/public/images/${req.file.filename}`);
    }
    next(error);
  }
};

/**
 * GET /api/renungan
 * Ambil semua data renungan
 */
export const getAllRenungan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const renungan = await renunganService.getAllRenungan();
    responses(res, 200, "Berhasil mengambil data semua renungan", { renungan });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/renungan/:slug
 * Ambil satu renungan berdasarkan slug
 */
export const getRenunganBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { slug } = req.params;
    const renungan = await renunganService.getRenungan(String(slug));
    responses(res, 200, "Data Renungan berhasil ditemukan", { renungan });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/renungan/:slug
 * Update data renungan (Mendukung upload gambar baru)
 */
export const updateRenungan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { slug } = req.params;
    const newImagePath = resolveImagePath(req);

    const updatePayload = {
      ...req.body,
      ...(newImagePath ? { image: newImagePath } : {}),
    };

    const renungan = await renunganService.updateRenungan(
      String(slug),
      updatePayload,
    );

    responses(res, 200, "Data Renungan berhasil diperbarui", { renungan });
  } catch (error) {
    // Hapus file baru jika update gagal
    if (req.file) {
      deleteUploadedFile(`/public/images/${req.file.filename}`);
    }
    next(error);
  }
};

/**
 * DELETE /api/renungan/:slug
 * Hapus data renungan dan file gambarnya
 */
export const deleteRenungan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { slug } = req.params;
    await renunganService.deleteRenungan(String(slug));
    responses(res, 200, "Data Renungan berhasil dihapus", null);
  } catch (error) {
    next(error);
  }
};
