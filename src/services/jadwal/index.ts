import express from "express";
import jadwalRoutes from "./routes/JadwalRoutes";
import { verifyRoles, verifyToken } from "../../middlewares/VerifyToken";

const indexJadwalRoutes: express.Router = express.Router();

indexJadwalRoutes.use(verifyToken);
indexJadwalRoutes.use(
  verifyRoles("PENGELOLA", "ADMIN", "SUPER_ADMIN", "PHMJ", "MAJELIS"),
);
indexJadwalRoutes.use(jadwalRoutes);

export default indexJadwalRoutes;
