"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryServices = void 0;
const exceptions_1 = require("../../../exceptions");
const multer_1 = require("../../../utils/multer");
class GalleryServices {
    galleryRepository;
    constructor(galleryRepository) {
        this.galleryRepository = galleryRepository;
    }
    async getAllGallery() {
        return this.galleryRepository.getAllGallery();
    }
    async getHomeGallery(limit) {
        return this.galleryRepository.getHomeGallery(limit);
    }
    async getGalleryById(id) {
        const gallery = await this.galleryRepository.getGallery(id);
        if (!gallery) {
            throw new exceptions_1.NotFoundError(`Foto galeri dengan id "${id}" tidak ditemukan`);
        }
        return gallery;
    }
    async createGallery(data) {
        if (!data.image || typeof data.image !== "string" || data.image.trim().length === 0) {
            throw new exceptions_1.InvariantError("File gambar galeri wajib diunggah");
        }
        return this.galleryRepository.createGallery(data);
    }
    async updateGallery(id, data) {
        const existing = await this.getGalleryById(id);
        // Hapus foto lama jika diganti dengan foto baru
        if (data.image && typeof data.image === "string" && data.image !== existing.image) {
            (0, multer_1.deleteUploadedFile)(existing.image);
        }
        return this.galleryRepository.updateGallery(id, data);
    }
    async deleteGallery(id) {
        const existing = await this.getGalleryById(id);
        if (existing.image) {
            (0, multer_1.deleteUploadedFile)(existing.image);
        }
        return this.galleryRepository.deleteGallery(id);
    }
}
exports.GalleryServices = GalleryServices;
//# sourceMappingURL=GalleryServices.js.map