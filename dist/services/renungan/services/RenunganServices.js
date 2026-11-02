"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenunganServices = void 0;
const exceptions_1 = require("../../../exceptions");
const helpers_1 = require("../../../utils/helpers");
const multer_1 = require("../../../utils/multer");
class RenunganServices {
    renunganRepository;
    constructor(renunganRepository) {
        this.renunganRepository = renunganRepository;
    }
    /**
     * Ambil semua data renungan, diurutkan berdasarkan publishedAt terbaru.
     */
    async getAllRenungan() {
        return await this.renunganRepository.getAllRenungan();
    }
    /**
     * Ambil satu renungan berdasarkan slug.
     * Lempar NotFoundError jika data tidak ditemukan.
     */
    async getRenungan(slug) {
        const renungan = await this.renunganRepository.getRenungan(slug);
        if (!renungan) {
            throw new exceptions_1.NotFoundError(`Renungan dengan slug "${slug}" tidak ditemukan`);
        }
        return renungan;
    }
    /**
     * Buat renungan baru:
     * - Validasi judul & gambar
     * - Generate slug unik dari judul
     * - Simpan ke database
     */
    async createRenungan(data) {
        if (!data.title || typeof data.title !== "string" || data.title.trim().length === 0) {
            throw new exceptions_1.InvariantError("Judul renungan wajib diisi");
        }
        if (!data.image || typeof data.image !== "string" || data.image.trim().length === 0) {
            throw new exceptions_1.InvariantError("Gambar renungan wajib diunggah");
        }
        // Generate slug otomatis dari title
        let slug = (0, helpers_1.generateSlug)(data.title);
        // Pastikan slug unik jika terjadi benturan
        const existing = await this.renunganRepository.getRenungan(slug);
        if (existing) {
            slug = `${slug}-${Date.now().toString().slice(-4)}`;
        }
        const payload = {
            ...data,
            slug,
        };
        return this.renunganRepository.createRenungan(payload);
    }
    /**
     * Update data renungan berdasarkan slug lama:
     * - Pastikan data ada
     * - Jika judul berubah, perbarui slug
     * - Jika gambar baru diunggah, hapus file gambar lama dari storage
     */
    async updateRenungan(slug, data) {
        const existing = await this.getRenungan(slug);
        const payload = { ...data };
        // Jika title diupdate dan tidak kosong, generate slug baru
        if (data.title && typeof data.title === "string" && data.title.trim().length > 0) {
            let newSlug = (0, helpers_1.generateSlug)(data.title);
            if (newSlug !== slug) {
                const slugTaken = await this.renunganRepository.getRenungan(newSlug);
                if (slugTaken && slugTaken.id !== existing.id) {
                    newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
                }
                payload.slug = newSlug;
            }
        }
        // Jika gambar baru diunggah, hapus gambar lama dari disk
        if (data.image && typeof data.image === "string" && data.image !== existing.image) {
            (0, multer_1.deleteUploadedFile)(existing.image);
        }
        return this.renunganRepository.updateRenungan(slug, payload);
    }
    /**
     * Hapus renungan berdasarkan slug:
     * - Pastikan data ada
     * - Hapus file gambar terkait dari storage
     * - Hapus record dari database
     */
    async deleteRenungan(slug) {
        const existing = await this.getRenungan(slug);
        // Hapus file gambar dari server
        if (existing.image) {
            (0, multer_1.deleteUploadedFile)(existing.image);
        }
        return this.renunganRepository.deleteRenungan(slug);
    }
}
exports.RenunganServices = RenunganServices;
//# sourceMappingURL=RenunganServices.js.map