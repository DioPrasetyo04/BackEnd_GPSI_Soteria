import express from "express";
import {
  createRenungan,
  getAllRenungan,
  getRenunganBySlug,
  updateRenungan,
  deleteRenungan,
} from "../controllers/RenunganController";
import { uploadDynamicfile } from "../../../utils/multer";
import { validateRequest } from "../../../middlewares/ValidateRequest";
import {
  renunganCreateSchema,
  renunganUpdateSchema,
} from "../validator/RenunganSchema";

const renunganRoutes: express.Router = express.Router();

/**
 * Renungan Routes
 *
 * POST   /api/renungan       → Tambah renungan baru (Multipart form: field "image" + text fields)
 * GET    /api/renungan       → Ambil semua data renungan (terbaru lebih dulu)
 * GET    /api/renungan/:slug → Ambil detail renungan berdasarkan slug
 * PUT    /api/renungan/:slug → Update renungan (opsional unggah gambar baru "image")
 * DELETE /api/renungan/:slug → Hapus renungan dan hapus gambar terkait di disk
 */
renunganRoutes.post(
  "/",
  uploadDynamicfile.single("image"),
  validateRequest(renunganCreateSchema),
  createRenungan,
);

renunganRoutes.get("/", getAllRenungan);

renunganRoutes.get("/:slug", getRenunganBySlug);

renunganRoutes.put(
  "/:slug",
  uploadDynamicfile.single("image"),
  validateRequest(renunganUpdateSchema),
  updateRenungan,
);

renunganRoutes.delete("/:slug", deleteRenungan);

export default renunganRoutes;