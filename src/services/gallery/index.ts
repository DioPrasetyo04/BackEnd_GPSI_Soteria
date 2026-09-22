import express from "express";
import galleryRoutes from "./routes/GalleryRoutes";
import { verifyRoles, verifyToken } from "../../middlewares/VerifyToken";

const indexGalleryRoutes: express.Router = express.Router();

indexGalleryRoutes.use(verifyToken);
indexGalleryRoutes.use(verifyRoles("PENGELOLA", "ADMIN", "SUPER_ADMIN"));
indexGalleryRoutes.use(galleryRoutes);

export default indexGalleryRoutes;
