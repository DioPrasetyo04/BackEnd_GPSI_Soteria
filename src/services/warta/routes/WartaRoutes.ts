import express from "express";
import {
  createWarta,
  getAllWarta,
  getWartaBySlug,
  updateWarta,
  deleteWarta,
} from "../controllers/WartaController";
import { uploadWartaFile, validateWartaFileSize } from "../../../utils/multer";
import { validateRequest } from "../../../middlewares/ValidateRequest";
import {
  wartaCreateSchema,
  wartaUpdateSchema,
} from "../validator/WartaSchema";

const wartaRoutes: express.Router = express.Router();

/**
 * Warta Routes
 *
 * POST   /api/warta       → Upload warta baru (form-data: field "fileUrl", Dokumen maks 4MB, Gambar maks 3MB)
 * GET    /api/warta       → Ambil semua data warta (urut terbaru)
 * GET    /api/warta/:slug → Ambil detail warta by slug
 * PUT    /api/warta/:slug → Update warta (opsional upload file dokumen/gambar baru)
 * DELETE /api/warta/:slug → Hapus warta dan file dokumen dari storage
 */
wartaRoutes.post(
  "/",
  uploadWartaFile.single("fileUrl"),
  validateWartaFileSize,
  validateRequest(wartaCreateSchema),
  createWarta,
);

wartaRoutes.get("/", getAllWarta);

wartaRoutes.get("/:slug", getWartaBySlug);

wartaRoutes.put(
  "/:slug",
  uploadWartaFile.single("fileUrl"),
  validateWartaFileSize,
  validateRequest(wartaUpdateSchema),
  updateWarta,
);

wartaRoutes.delete("/:slug", deleteWarta);

export default wartaRoutes;
