"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WartaRepositories = void 0;
const database_1 = require("../../../config/database");
class WartaRepositories {
    async createWarta(data) {
        return database_1.prisma.warta.create({ data });
    }
    async getWarta(slug) {
        return database_1.prisma.warta.findUnique({ where: { slug } });
    }
    async getWartaById(id) {
        return database_1.prisma.warta.findUnique({ where: { id } });
    }
    async getAllWarta() {
        return database_1.prisma.warta.findMany({
            orderBy: { publishedAt: "desc" },
        });
    }
    async updateWarta(slug, data) {
        return database_1.prisma.warta.update({ where: { slug }, data });
    }
    async deleteWarta(slug) {
        const deleted = await database_1.prisma.warta.delete({ where: { slug } });
        return !!deleted;
    }
    async countWarta(where) {
        return database_1.prisma.warta.count({ where });
    }
}
exports.WartaRepositories = WartaRepositories;
//# sourceMappingURL=WartaRepository.js.map