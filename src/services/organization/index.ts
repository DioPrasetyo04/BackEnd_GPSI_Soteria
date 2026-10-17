import express from "express";
import organizationRoutes from "./routes/OrganizationRoutes";

const indexOrganizationRoutes: express.Router = express.Router();

indexOrganizationRoutes.use(organizationRoutes);

export default indexOrganizationRoutes;

