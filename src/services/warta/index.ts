import express from "express";
import wartaRoutes from "./routes/WartaRoutes";

const indexWartaRoutes: express.Router = express.Router();

indexWartaRoutes.use(wartaRoutes);

export default indexWartaRoutes;

