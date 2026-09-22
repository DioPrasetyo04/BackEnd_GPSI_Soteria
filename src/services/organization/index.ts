import express from "express";
import organizationRoutes from "./routes/OrganizationRoutes";
import { verifyRoles, verifyToken } from "../../middlewares/VerifyToken";

const indexOrganizationRoutes: express.Router = express.Router();

indexOrganizationRoutes.use(verifyToken);
indexOrganizationRoutes.use(verifyRoles("ADMIN", "SUPER_ADMIN", "PHMJ", "MAJELIS"));
indexOrganizationRoutes.use(organizationRoutes);

export default indexOrganizationRoutes;
