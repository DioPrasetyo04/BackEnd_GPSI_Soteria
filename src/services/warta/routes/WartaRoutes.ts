import express from "express";
import {
  createWarta,
  getAllWarta,
  getWartaBySlug,
  updateWarta,
  deleteWarta,
} from "../controllers/WartaController";
import { uploadDynamicfile } from "../../../utils/multer";
import {
  validateRequest,
  validateQuery,
} from "../../../middlewares/ValidateRequest";
import {
  wartaCreateSchema,
  wartaUpdateSchema,
  wartaListQuerySchema,
} from "../validator/WartaSchema";

const wartaRoutes: express.Router = express.Router();

/**
 * Warta Routes
 *
 * POST   /api/warta       → Upload warta baru (form-data: field "fileUrl" / "file" + text fields)
 * GET    /api/warta       → Ambil daftar warta dengan pencarian, pengurutan, dan paginasi
 * GET    /api/warta/:slug → Ambil detail warta by slug
 * PUT    /api/warta/:slug → Update warta (opsional upload file dokumen baru)
 * DELETE /api/warta/:slug → Hapus warta dan file dokumen dari storage
 */
wartaRoutes.post(
  "/",
  uploadDynamicfile.single("fileUrl"),
  validateRequest(wartaCreateSchema),
  createWarta,
);

wartaRoutes.get("/", validateQuery(wartaListQuerySchema), getAllWarta);

wartaRoutes.get("/:slug", getWartaBySlug);

wartaRoutes.put(
  "/:slug",
  uploadDynamicfile.single("fileUrl"),
  validateRequest(wartaUpdateSchema),
  updateWarta,
);

wartaRoutes.delete("/:slug", deleteWarta);

export default wartaRoutes;
