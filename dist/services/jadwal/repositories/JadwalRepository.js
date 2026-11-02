"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JadwalRepositories = void 0;
const database_1 = require("../../../config/database");
class JadwalRepositories {
    async createJadwal(data) {
        return database_1.prisma.jadwal.create({ data });
    }
    async getJadwal(id) {
        return database_1.prisma.jadwal.findUnique({ where: { id } });
    }
    async getAllJadwal() {
        return database_1.prisma.jadwal.findMany({
            orderBy: { date: "asc" },
        });
    }
    async updateJadwal(id, data) {
        return database_1.prisma.jadwal.update({ where: { id }, data });
    }
    async deleteJadwal(id) {
        const deleted = await database_1.prisma.jadwal.delete({ where: { id } });
        return !!deleted;
    }
    async countJadwal(where) {
        return database_1.prisma.jadwal.count({ where });
    }
}
exports.JadwalRepositories = JadwalRepositories;
//# sourceMappingURL=JadwalRepository.js.map