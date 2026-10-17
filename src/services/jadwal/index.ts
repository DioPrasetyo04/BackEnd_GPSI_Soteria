import express from "express";
import jadwalRoutes from "./routes/JadwalRoutes";

const indexJadwalRoutes: express.Router = express.Router();

indexJadwalRoutes.use(jadwalRoutes);

export default indexJadwalRoutes;

