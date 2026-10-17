import type { Request, Response, NextFunction } from "express";
import { GalleryRepositories } from "../repositories/GalleryRepository";
import { GalleryServices } from "../services/GalleryServices";
import responses from "../../../utils/response";
import { deleteUploadedFile } from "../../../utils/multer";

const galleryRepo = new GalleryRepositories();
const galleryService = new GalleryServices(galleryRepo);

const resolveImagePath = (req: Request): string | undefined => {
  if (req.file) {
    return `/public/images/${req.file.filename}`;
  }
  if (typeof req.body?.image === "string" && req.body.image.trim().length > 0) {
    return req.body.image;
  }
  return undefined;
};

export const createGallery = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const imagePath = resolveImagePath(req);

    const gallery = await galleryService.createGallery({
      ...req.body,
      image: imagePath || "",
    });

    responses(res, 201, "Data galeri berhasil ditambahkan", { gallery });
  } catch (error) {
    if (req.file) {
      deleteUploadedFile(`/public/images/${req.file.filename}`);
    }
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
    const newImagePath = resolveImagePath(req);

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
    if (req.file) {
      deleteUploadedFile(`/public/images/${req.file.filename}`);
    }
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
    await galleryService.deleteGallery(String(id));
    responses(res, 200, "Data galeri berhasil dihapus", null);
  } catch (error) {
    next(error);
  }
};
