import type { Prisma } from "../../../generated/prisma/client";
import type { JadwalInterface } from "../data_interfaces/JadwalInterface";
import type { JadwalInterfaceRepository } from "../interfaces/IJadwalRepositories";
import { prisma } from "../../../config/database";

export class JadwalRepositories implements JadwalInterfaceRepository {
  async createJadwal(data: Prisma.JadwalCreateInput): Promise<JadwalInterface> {
    return prisma.jadwal.create({ data });
  }

  async getJadwal(id: string): Promise<JadwalInterface | null> {
    return prisma.jadwal.findUnique({ where: { id } });
  }

  async getAllJadwal(): Promise<JadwalInterface[]> {
    return prisma.jadwal.findMany({
      orderBy: { date: "asc" },
    });
  }

  async updateJadwal(
    id: string,
    data: Prisma.JadwalUpdateInput,
  ): Promise<JadwalInterface> {
    return prisma.jadwal.update({ where: { id }, data });
  }

  async deleteJadwal(id: string): Promise<boolean> {
    const deleted = await prisma.jadwal.delete({ where: { id } });
    return !!deleted;
  }
}
