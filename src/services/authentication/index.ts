import express from "express";
import authRoutes from "./routes/AuthRoutes";

const indexAuthRoutes: express.Router = express.Router();

indexAuthRoutes.use(authRoutes);

export default indexAuthRoutes;
