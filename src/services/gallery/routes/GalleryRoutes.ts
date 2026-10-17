import express from "express";
import {
  createGallery,
  getAllGallery,
  getGalleryById,
  updateGallery,
  deleteGallery,
} from "../controllers/GalleryController";
import { uploadDynamicfile } from "../../../utils/multer";
import { validateRequest } from "../../../middlewares/ValidateRequest";
import {
  galleryCreateSchema,
  galleryUpdateSchema,
} from "../validator/GallerySchema";

const galleryRoutes: express.Router = express.Router();

/**
 * Gallery Routes
 *
 * POST   /api/gallery       → Tambah foto baru (form-data: field "image" + text fields)
 * GET    /api/gallery       → Ambil semua data galeri (urut terbaru)
 * GET    /api/gallery/:id   → Ambil detail galeri by ID
 * PUT    /api/gallery/:id   → Update galeri (opsional upload file "image" baru)
 * DELETE /api/gallery/:id   → Hapus galeri dan hapus file foto dari disk
 */
galleryRoutes.post(
  "/",
  uploadDynamicfile.single("image"),
  validateRequest(galleryCreateSchema),
  createGallery,
);

galleryRoutes.get("/", getAllGallery);

galleryRoutes.get("/:id", getGalleryById);

galleryRoutes.put(
  "/:id",
  uploadDynamicfile.single("image"),
  validateRequest(galleryUpdateSchema),
  updateGallery,
);

galleryRoutes.delete("/:id", deleteGallery);

export default galleryRoutes;
