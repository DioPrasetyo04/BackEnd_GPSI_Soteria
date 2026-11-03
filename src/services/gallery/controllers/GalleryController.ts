import type { Request, Response, NextFunction } from "express";
import { GalleryRepositories } from "../repositories/GalleryRepository";
import { GalleryServices } from "../services/GalleryServices";
import responses from "../../../utils/response";
import { uploadToStorage, deleteFromStorage } from "../../../utils/cloudStorage";

const galleryRepo = new GalleryRepositories();
const galleryService = new GalleryServices(galleryRepo);

export const createGallery = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let imagePath: string | undefined;

    if (req.file) {
      imagePath = await uploadToStorage(req.file, {
        bucket: "gallery",
        folder: "images",
      });
    } else if (
      typeof req.body?.image === "string" &&
      req.body.image.trim().length > 0
    ) {
      imagePath = req.body.image;
    }

    const gallery = await galleryService.createGallery({
      ...req.body,
      image: imagePath || "",
    });

    responses(res, 201, "Data galeri berhasil ditambahkan", { gallery });
  } catch (error) {
    next(error);
  }
};

export const getAllGallery = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const gallery = await galleryService.getAllGallery();
    responses(res, 200, "Berhasil mengambil data semua galeri", { gallery });
  } catch (error) {
    next(error);
  }
};

export const getHomeGallery = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const rawLimit = req.query.limit;
    const parsed =
      typeof rawLimit === "string" ? Number.parseInt(rawLimit, 10) : NaN;
    const limit = Number.isFinite(parsed) && parsed > 0 ? parsed : 5;

    const gallery = await galleryService.getHomeGallery(limit);
    responses(res, 200, "Berhasil mengambil galeri beranda", { gallery });
  } catch (error) {
    next(error);
  }
};

export const getGalleryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const gallery = await galleryService.getGalleryById(String(id));
    responses(res, 200, "Data galeri ditemukan", { gallery });
  } catch (error) {
    next(error);
  }
};

export const updateGallery = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    let newImagePath: string | undefined;

    if (req.file) {
      newImagePath = await uploadToStorage(req.file, {
        bucket: "gallery",
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

    const gallery = await galleryService.updateGallery(
      String(id),
      updatePayload,
    );

    responses(res, 200, "Data galeri berhasil diperbarui", { gallery });
  } catch (error) {
    next(error);
  }
};

export const deleteGallery = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await galleryService.getGalleryById(String(id));
    if (existing?.image) {
      await deleteFromStorage(existing.image, "gallery");
    }
    await galleryService.deleteGallery(String(id));
    responses(res, 200, "Data galeri berhasil dihapus", null);
  } catch (error) {
    next(error);
  }
};
