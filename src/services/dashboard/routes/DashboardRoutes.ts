import express from "express";
import { getDashboardStats } from "../controllers/DashboardController";

const dashboardRoutes: express.Router = express.Router();

dashboardRoutes.get("/stats", getDashboardStats);
dashboardRoutes.get("/", getDashboardStats);

export default dashboardRoutes;
