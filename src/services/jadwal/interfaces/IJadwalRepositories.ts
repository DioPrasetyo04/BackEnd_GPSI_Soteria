import type { Prisma } from "../../../generated/prisma/client";
import type { JadwalInterface } from "../data_interfaces/JadwalInterface";

export interface JadwalInterfaceRepository {
  createJadwal(data: Prisma.JadwalCreateInput): Promise<JadwalInterface>;
  getJadwal(id: string): Promise<JadwalInterface | null>;
  getAllJadwal(): Promise<JadwalInterface[]>;
  updateJadwal(
    id: string,
    data: Prisma.JadwalUpdateInput,
  ): Promise<JadwalInterface>;
  deleteJadwal(id: string): Promise<boolean>;
  countJadwal(where?: Prisma.JadwalWhereInput): Promise<number>;
}

export type IJadwalRepositories = JadwalInterfaceRepository;
