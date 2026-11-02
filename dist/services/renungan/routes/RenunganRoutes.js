"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RenunganController_1 = require("../controllers/RenunganController");
const multer_1 = require("../../../utils/multer");
const ValidateRequest_1 = require("../../../middlewares/ValidateRequest");
const RenunganSchema_1 = require("../validator/RenunganSchema");
const renunganRoutes = express_1.default.Router();
/**
 * Renungan Routes
 *
 * POST   /api/renungan       → Tambah renungan baru (Multipart form: field "image" + text fields)
 * GET    /api/renungan       → Ambil semua data renungan (terbaru lebih dulu)
 * GET    /api/renungan/:slug → Ambil detail renungan berdasarkan slug
 * PUT    /api/renungan/:slug → Update renungan (opsional unggah gambar baru "image")
 * DELETE /api/renungan/:slug → Hapus renungan dan hapus gambar terkait di disk
 */
renunganRoutes.post("/", multer_1.uploadDynamicfile.single("image"), (0, ValidateRequest_1.validateRequest)(RenunganSchema_1.renunganCreateSchema), RenunganController_1.createRenungan);
renunganRoutes.get("/", RenunganController_1.getAllRenungan);
renunganRoutes.get("/:slug", RenunganController_1.getRenunganBySlug);
renunganRoutes.put("/:slug", multer_1.uploadDynamicfile.single("image"), (0, ValidateRequest_1.validateRequest)(RenunganSchema_1.renunganUpdateSchema), RenunganController_1.updateRenungan);
renunganRoutes.delete("/:slug", RenunganController_1.deleteRenungan);
exports.default = renunganRoutes;
//# sourceMappingURL=RenunganRoutes.js.map