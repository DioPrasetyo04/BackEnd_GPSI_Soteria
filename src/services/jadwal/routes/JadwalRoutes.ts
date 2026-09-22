import express from "express";
import {
  createJadwal,
  getAllJadwal,
  getJadwalById,
  updateJadwal,
  deleteJadwal,
} from "../controllers/JadwalController";
import { validateRequest } from "../../../middlewares/ValidateRequest";
import {
  jadwalCreateSchema,
  jadwalUpdateSchema,
} from "../validator/JadwalSchema";

const jadwalRoutes: express.Router = express.Router();

jadwalRoutes.post("/", validateRequest(jadwalCreateSchema), createJadwal);
jadwalRoutes.get("/", getAllJadwal);
jadwalRoutes.get("/:id", getJadwalById);
jadwalRoutes.put("/:id", validateRequest(jadwalUpdateSchema), updateJadwal);
jadwalRoutes.delete("/:id", deleteJadwal);

export default jadwalRoutes;
