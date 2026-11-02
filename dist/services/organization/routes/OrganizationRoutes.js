"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const OrganizationController_1 = require("../controllers/OrganizationController");
const ValidateRequest_1 = require("../../../middlewares/ValidateRequest");
const OrganizationSchema_1 = require("../validator/OrganizationSchema");
const organizationRoutes = express_1.default.Router();
/**
 * Organization Routes
 *
 * POST   /api/organization       → Tambah pengurus baru
 * GET    /api/organization       → Ambil semua data (bisa filter ?category=PENGURUS_HARIAN atau KOORDINATOR_SEKTOR)
 * GET    /api/organization/:id   → Ambil pengurus by ID
 * PUT    /api/organization/:id   → Update pengurus
 * DELETE /api/organization/:id   → Hapus pengurus
 */
organizationRoutes.post("/", (0, ValidateRequest_1.validateRequest)(OrganizationSchema_1.organizationCreateSchema), OrganizationController_1.createOrganization);
organizationRoutes.get("/", OrganizationController_1.getAllOrganizations);
organizationRoutes.get("/:id", OrganizationController_1.getOrganizationById);
organizationRoutes.put("/:id", (0, ValidateRequest_1.validateRequest)(OrganizationSchema_1.organizationUpdateSchema), OrganizationController_1.updateOrganization);
organizationRoutes.delete("/:id", OrganizationController_1.deleteOrganization);
exports.default = organizationRoutes;
//# sourceMappingURL=OrganizationRoutes.js.map