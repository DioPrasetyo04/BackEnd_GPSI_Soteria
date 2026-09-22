import express from "express";
import {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} from "../controllers/OrganizationController";
import { validateRequest } from "../../../middlewares/ValidateRequest";
import {
  organizationCreateSchema,
  organizationUpdateSchema,
} from "../validator/OrganizationSchema";

const organizationRoutes: express.Router = express.Router();

/**
 * Organization Routes
 *
 * POST   /api/organization       → Tambah pengurus baru
 * GET    /api/organization       → Ambil semua data (bisa filter ?category=PENGURUS_HARIAN atau KOORDINATOR_SEKTOR)
 * GET    /api/organization/:id   → Ambil pengurus by ID
 * PUT    /api/organization/:id   → Update pengurus
 * DELETE /api/organization/:id   → Hapus pengurus
 */
organizationRoutes.post(
  "/",
  validateRequest(organizationCreateSchema),
  createOrganization,
);

organizationRoutes.get("/", getAllOrganizations);

organizationRoutes.get("/:id", getOrganizationById);

organizationRoutes.put(
  "/:id",
  validateRequest(organizationUpdateSchema),
  updateOrganization,
);

organizationRoutes.delete("/:id", deleteOrganization);

export default organizationRoutes;
