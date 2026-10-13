import express from "express";
import {
  createJadwal,
  getAllJadwal,
  getJadwalById,
  updateJadwal,
  deleteJadwal,
} from "../controllers/JadwalController";
import {
  validateRequest,
  validateQuery,
} from "../../../middlewares/ValidateRequest";
import {
  jadwalCreateSchema,
  jadwalUpdateSchema,
  jadwalQuerySchema,
} from "../validator/JadwalSchema";

const jadwalRoutes: express.Router = express.Router();

jadwalRoutes.post("/", validateRequest(jadwalCreateSchema), createJadwal);
jadwalRoutes.get("/", validateQuery(jadwalQuerySchema), getAllJadwal);
jadwalRoutes.get("/:id", getJadwalById);
jadwalRoutes.put("/:id", validateRequest(jadwalUpdateSchema), updateJadwal);
jadwalRoutes.delete("/:id", deleteJadwal);

export default jadwalRoutes;
