import express from "express";
import userRoutes from "./routes/UserRoutes";
import { verifyRoles, verifyToken } from "../../middlewares/VerifyToken";

const indexUserRoutes: express.Router = express.Router();

indexUserRoutes.use(verifyToken);
indexUserRoutes.use(verifyRoles("ADMIN", "SUPER_ADMIN"));
indexUserRoutes.use(userRoutes);

export default indexUserRoutes;
