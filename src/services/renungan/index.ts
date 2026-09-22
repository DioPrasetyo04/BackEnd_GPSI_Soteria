import express from "express";
import renunganRoutes from "./routes/RenunganRoutes";
import { verifyRoles, verifyToken } from "../../middlewares/VerifyToken";

const indexRenunganRoutes: express.Router = express.Router();

indexRenunganRoutes.use(verifyToken);
indexRenunganRoutes.use(verifyRoles("PHMJ", "MAJELIS", "PENGELOLA"));
indexRenunganRoutes.use(renunganRoutes);

export default indexRenunganRoutes;
