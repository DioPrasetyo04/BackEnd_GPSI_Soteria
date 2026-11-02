import type { Request, Response, NextFunction } from "express";
import { RenunganRepositories } from "../repositories/RenunganRepository";
import { RenunganServices } from "../services/RenunganServices";
import responses from "../../../utils/response";
import { uploadToStorage, deleteFromStorage } from "../../../utils/cloudStorage";

const renunganRepo = new RenunganRepositories();
const renunganService = new RenunganServices(renunganRepo);

export const createRenungan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let imagePath: string | undefined;

    if (req.file) {
      imagePath = await uploadToStorage(req.file, {
        bucket: "renungan",
        folder: "images",
      });
    } else if (
      typeof req.body?.image === "string" &&
      req.body.image.trim().length > 0
    ) {
      imagePath = req.body.image;
    }

    const renungan = await renunganService.createRenungan({
      ...req.body,
      image: imagePath || "",
    });

    responses(res, 201, "Data Renungan berhasil dibuat", { renungan });
  } catch (error) {
    next(error);
  }
};

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

export const updateRenungan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { slug } = req.params;
    let newImagePath: string | undefined;

    if (req.file) {
      newImagePath = await uploadToStorage(req.file, {
        bucket: "renungan",
        folder: "images",
      });
    } else if (
      typeof req.body?.image === "string" &&
      req.body.image.trim().length > 0
    ) {
      newImagePath = req.body.image;
    }

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
    next(error);
  }
};

export const deleteRenungan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { slug } = req.params;
    const existing = await renunganService.getRenungan(String(slug));
    if (existing?.image) {
      await deleteFromStorage(existing.image, "renungan");
    }
    await renunganService.deleteRenungan(String(slug));
    responses(res, 200, "Data Renungan berhasil dihapus", null);
  } catch (error) {
    next(error);
  }
};
