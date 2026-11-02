"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JadwalServices = void 0;
const exceptions_1 = require("../../../exceptions");
class JadwalServices {
    jadwalRepository;
    constructor(jadwalRepository) {
        this.jadwalRepository = jadwalRepository;
    }
    async getAllJadwal() {
        return this.jadwalRepository.getAllJadwal();
    }
    async getJadwalById(id) {
        const jadwal = await this.jadwalRepository.getJadwal(id);
        if (!jadwal) {
            throw new exceptions_1.NotFoundError(`Jadwal dengan id "${id}" tidak ditemukan`);
        }
        return jadwal;
    }
    async createJadwal(data) {
        return this.jadwalRepository.createJadwal(data);
    }
    async updateJadwal(id, data) {
        await this.getJadwalById(id); // Pastikan ada
        return this.jadwalRepository.updateJadwal(id, data);
    }
    async deleteJadwal(id) {
        await this.getJadwalById(id); // Pastikan ada
        return this.jadwalRepository.deleteJadwal(id);
    }
}
exports.JadwalServices = JadwalServices;
//# sourceMappingURL=JadwalServices.js.map