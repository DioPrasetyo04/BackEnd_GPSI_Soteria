import express from "express";
import galleryRoutes from "./routes/GalleryRoutes";

const indexGalleryRoutes: express.Router = express.Router();

indexGalleryRoutes.use(galleryRoutes);

export default indexGalleryRoutes;

