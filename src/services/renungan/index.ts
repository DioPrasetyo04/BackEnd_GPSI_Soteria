import express from "express";
import renunganRoutes from "./routes/RenunganRoutes";

const indexRenunganRoutes: express.Router = express.Router();

indexRenunganRoutes.use(renunganRoutes);

export default indexRenunganRoutes;

