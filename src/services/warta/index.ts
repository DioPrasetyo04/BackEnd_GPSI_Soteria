import express from "express";
import wartaRoutes from "./routes/WartaRoutes";
import { verifyRoles, verifyToken } from "../../middlewares/VerifyToken";

const indexWartaRoutes: express.Router = express.Router();

indexWartaRoutes.use(verifyToken);
indexWartaRoutes.use(verifyRoles("PENGELOLA", "ADMIN", "SUPER_ADMIN"));
indexWartaRoutes.use(wartaRoutes);

export default indexWartaRoutes;
