"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryRepositories = void 0;
const database_1 = require("../../../config/database");
class GalleryRepositories {
    async createGallery(data) {
        return database_1.prisma.gallery.create({ data });
    }
    async getGallery(id) {
        return database_1.prisma.gallery.findUnique({ where: { id } });
    }
    async getAllGallery() {
        return database_1.prisma.gallery.findMany({
            orderBy: { date: "desc" },
        });
    }
    async updateGallery(id, data) {
        return database_1.prisma.gallery.update({ where: { id }, data });
    }
    async deleteGallery(id) {
        const deleted = await database_1.prisma.gallery.delete({ where: { id } });
        return !!deleted;
    }
    async countGallery(where) {
        return database_1.prisma.gallery.count({ where });
    }
}
exports.GalleryRepositories = GalleryRepositories;
//# sourceMappingURL=GalleryRepository.js.map