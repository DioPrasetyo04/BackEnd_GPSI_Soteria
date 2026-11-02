"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GalleryController_1 = require("../controllers/GalleryController");
const multer_1 = require("../../../utils/multer");
const ValidateRequest_1 = require("../../../middlewares/ValidateRequest");
const GallerySchema_1 = require("../validator/GallerySchema");
const galleryRoutes = express_1.default.Router();
/**
 * Gallery Routes
 *
 * POST   /api/gallery       → Tambah foto baru (form-data: field "image" + text fields)
 * GET    /api/gallery       → Ambil semua data galeri (urut terbaru)
 * GET    /api/gallery/:id   → Ambil detail galeri by ID
 * PUT    /api/gallery/:id   → Update galeri (opsional upload file "image" baru)
 * DELETE /api/gallery/:id   → Hapus galeri dan hapus file foto dari disk
 */
galleryRoutes.post("/", multer_1.uploadDynamicfile.single("image"), (0, ValidateRequest_1.validateRequest)(GallerySchema_1.galleryCreateSchema), GalleryController_1.createGallery);
galleryRoutes.get("/", GalleryController_1.getAllGallery);
galleryRoutes.get("/:id", GalleryController_1.getGalleryById);
galleryRoutes.put("/:id", multer_1.uploadDynamicfile.single("image"), (0, ValidateRequest_1.validateRequest)(GallerySchema_1.galleryUpdateSchema), GalleryController_1.updateGallery);
galleryRoutes.delete("/:id", GalleryController_1.deleteGallery);
exports.default = galleryRoutes;
//# sourceMappingURL=GalleryRoutes.js.map