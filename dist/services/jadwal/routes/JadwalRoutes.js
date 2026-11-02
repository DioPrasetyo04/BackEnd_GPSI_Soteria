"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JadwalController_1 = require("../controllers/JadwalController");
const ValidateRequest_1 = require("../../../middlewares/ValidateRequest");
const JadwalSchema_1 = require("../validator/JadwalSchema");
const jadwalRoutes = express_1.default.Router();
jadwalRoutes.post("/", (0, ValidateRequest_1.validateRequest)(JadwalSchema_1.jadwalCreateSchema), JadwalController_1.createJadwal);
jadwalRoutes.get("/", JadwalController_1.getAllJadwal);
jadwalRoutes.get("/:id", JadwalController_1.getJadwalById);
jadwalRoutes.put("/:id", (0, ValidateRequest_1.validateRequest)(JadwalSchema_1.jadwalUpdateSchema), JadwalController_1.updateJadwal);
jadwalRoutes.delete("/:id", JadwalController_1.deleteJadwal);
exports.default = jadwalRoutes;
//# sourceMappingURL=JadwalRoutes.js.map