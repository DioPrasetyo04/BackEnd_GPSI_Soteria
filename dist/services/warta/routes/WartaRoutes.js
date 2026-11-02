"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const WartaController_1 = require("../controllers/WartaController");
const multer_1 = require("../../../utils/multer");
const ValidateRequest_1 = require("../../../middlewares/ValidateRequest");
const WartaSchema_1 = require("../validator/WartaSchema");
const wartaRoutes = express_1.default.Router();
/**
 * Warta Routes
 *
 * POST   /api/warta       → Upload warta baru (form-data: field "fileUrl", Dokumen maks 4MB, Gambar maks 3MB)
 * GET    /api/warta       → Ambil semua data warta (urut terbaru)
 * GET    /api/warta/:slug → Ambil detail warta by slug
 * PUT    /api/warta/:slug → Update warta (opsional upload file dokumen/gambar baru)
 * DELETE /api/warta/:slug → Hapus warta dan file dokumen dari storage
 */
wartaRoutes.post("/", multer_1.uploadWartaFile.single("fileUrl"), multer_1.validateWartaFileSize, (0, ValidateRequest_1.validateRequest)(WartaSchema_1.wartaCreateSchema), WartaController_1.createWarta);
wartaRoutes.get("/", WartaController_1.getAllWarta);
wartaRoutes.get("/:slug", WartaController_1.getWartaBySlug);
wartaRoutes.put("/:slug", multer_1.uploadWartaFile.single("fileUrl"), multer_1.validateWartaFileSize, (0, ValidateRequest_1.validateRequest)(WartaSchema_1.wartaUpdateSchema), WartaController_1.updateWarta);
wartaRoutes.delete("/:slug", WartaController_1.deleteWarta);
exports.default = wartaRoutes;
//# sourceMappingURL=WartaRoutes.js.map