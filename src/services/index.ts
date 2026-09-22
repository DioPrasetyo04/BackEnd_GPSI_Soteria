import express from "express";
import authRoutes from "./authentication/index";
import jadwalRoutes from "./jadwal/index";
import renunganRoutes from "./renungan/index";
import wartaRoutes from "./warta/index";
import userRoutes from "./user/index";
import organizationRoutes from "./organization/index";
import galleryRoutes from "./gallery/index";

const allRoutes: express.Router = express.Router();

allRoutes.use("/auth", authRoutes);
allRoutes.use("/jadwal", jadwalRoutes);
allRoutes.use("/renungan", renunganRoutes);
allRoutes.use("/warta", wartaRoutes);
allRoutes.use("/user", userRoutes);
allRoutes.use("/organization", organizationRoutes);
allRoutes.use("/gallery", galleryRoutes);

export default allRoutes;
