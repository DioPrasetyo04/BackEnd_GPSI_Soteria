import type { JadwalInterface } from "../data_interfaces/JadwalInterface";
import type { JadwalInterfaceRepository } from "../interfaces/IJadwalRepositories";
import type { Prisma } from "../../../generated/prisma/client";
import { NotFoundError } from "../../../exceptions";

export class JadwalServices {
  constructor(
    private readonly jadwalRepository: JadwalInterfaceRepository,
  ) {}

  async getAllJadwal(): Promise<JadwalInterface[]> {
    return this.jadwalRepository.getAllJadwal();
  }

  async getJadwalById(id: string): Promise<JadwalInterface> {
    const jadwal = await this.jadwalRepository.getJadwal(id);
    if (!jadwal) {
      throw new NotFoundError(`Jadwal dengan id "${id}" tidak ditemukan`);
    }
    return jadwal;
  }

  async createJadwal(data: Prisma.JadwalCreateInput): Promise<JadwalInterface> {
    return this.jadwalRepository.createJadwal(data);
  }

  async updateJadwal(
    id: string,
    data: Prisma.JadwalUpdateInput,
  ): Promise<JadwalInterface> {
    await this.getJadwalById(id); // Pastikan ada
    return this.jadwalRepository.updateJadwal(id, data);
  }

  async deleteJadwal(id: string): Promise<boolean> {
    await this.getJadwalById(id); // Pastikan ada
    return this.jadwalRepository.deleteJadwal(id);
  }
}
