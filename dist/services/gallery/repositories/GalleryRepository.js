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
    async getHomeGallery(limit = 5) {
        const take = limit > 0 ? limit : 5;
        return database_1.prisma.gallery.findMany({
            where: {
                OR: [{ showInHome: true }, { highlight: true }],
            },
            orderBy: [{ highlight: "desc" }, { date: "desc" }],
            take,
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