"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WartaServices = void 0;
const exceptions_1 = require("../../../exceptions");
const helpers_1 = require("../../../utils/helpers");
const multer_1 = require("../../../utils/multer");
class WartaServices {
    wartaRepository;
    constructor(wartaRepository) {
        this.wartaRepository = wartaRepository;
    }
    async getAllWarta() {
        return this.wartaRepository.getAllWarta();
    }
    async getWarta(slug) {
        const warta = await this.wartaRepository.getWarta(slug);
        if (!warta) {
            throw new exceptions_1.NotFoundError(`Warta dengan slug "${slug}" tidak ditemukan`);
        }
        return warta;
    }
    async createWarta(data) {
        if (!data.title || typeof data.title !== "string" || data.title.trim().length === 0) {
            throw new exceptions_1.InvariantError("Judul warta wajib diisi");
        }
        if (!data.fileUrl || typeof data.fileUrl !== "string" || data.fileUrl.trim().length === 0) {
            throw new exceptions_1.InvariantError("Berkas warta (PDF, Word, atau Gambar) wajib diunggah");
        }
        let slug = (0, helpers_1.generateSlug)(data.title);
        const existing = await this.wartaRepository.getWarta(slug);
        if (existing) {
            slug = `${slug}-${Date.now().toString().slice(-4)}`;
        }
        const payload = {
            ...data,
            slug,
        };
        return this.wartaRepository.createWarta(payload);
    }
    async updateWarta(slug, data) {
        const existing = await this.getWarta(slug);
        const payload = { ...data };
        if (data.title && typeof data.title === "string" && data.title.trim().length > 0) {
            let newSlug = (0, helpers_1.generateSlug)(data.title);
            if (newSlug !== slug) {
                const slugTaken = await this.wartaRepository.getWarta(newSlug);
                if (slugTaken && slugTaken.id !== existing.id) {
                    newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
                }
                payload.slug = newSlug;
            }
        }
        // Update database terlebih dahulu
        const updated = await this.wartaRepository.updateWarta(slug, payload);
        // Jika database sukses diperbarui dan file baru diunggah, bersihkan file lama dari storage
        if (data.fileUrl && typeof data.fileUrl === "string" && data.fileUrl !== existing.fileUrl) {
            (0, multer_1.deleteUploadedFile)(existing.fileUrl);
        }
        return updated;
    }
    async deleteWarta(slug) {
        const existing = await this.getWarta(slug);
        // Hapus dari database terlebih dahulu
        const isDeleted = await this.wartaRepository.deleteWarta(slug);
        // Jika sukses terhapus dari DB, bersihkan file fisik dari storage
        if (isDeleted && existing.fileUrl) {
            (0, multer_1.deleteUploadedFile)(existing.fileUrl);
        }
        return isDeleted;
    }
}
exports.WartaServices = WartaServices;
//# sourceMappingURL=WartaServices.js.map