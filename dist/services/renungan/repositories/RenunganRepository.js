"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenunganRepositories = void 0;
const database_1 = require("../../../config/database");
class RenunganRepositories {
    async createRenungan(data) {
        const createRenungan = await database_1.prisma.renungan.create({
            data: data,
        });
        return createRenungan;
    }
    async getRenungan(slug) {
        const spesRenungan = await database_1.prisma.renungan.findUnique({
            where: {
                slug: slug,
            },
        });
        return spesRenungan;
    }
    async getAllRenungan() {
        const allRenungan = await database_1.prisma.renungan.findMany({
            orderBy: {
                publishedAt: "desc",
            },
        });
        return allRenungan;
    }
    async updateRenungan(slug, data) {
        const updateRenungan = await database_1.prisma.renungan.update({
            where: {
                slug: slug,
            },
            data: data,
        });
        return updateRenungan;
    }
    async deleteRenungan(slug) {
        const deleteRenungan = await database_1.prisma.renungan.delete({
            where: {
                slug: slug,
            },
        });
        return !!deleteRenungan;
    }
    async countRenungan(where) {
        return database_1.prisma.renungan.count({ where });
    }
}
exports.RenunganRepositories = RenunganRepositories;
//# sourceMappingURL=RenunganRepository.js.map