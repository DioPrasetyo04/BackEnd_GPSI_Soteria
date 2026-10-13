import type { Prisma } from "../../../generated/prisma/client";
import type {
  JadwalInterface,
  PaginatedJadwalResult,
  JadwalQueryOptions,
} from "../data_interfaces/JadwalInterface";

export interface JadwalInterfaceRepository {
  createJadwal(data: Prisma.JadwalCreateInput): Promise<JadwalInterface>;
  getJadwal(id: string): Promise<JadwalInterface | null>;
  getAllJadwal(options?: JadwalQueryOptions): Promise<PaginatedJadwalResult>;
  updateJadwal(
    id: string,
    data: Prisma.JadwalUpdateInput,
  ): Promise<JadwalInterface>;
  deleteJadwal(id: string): Promise<boolean>;
}

export type IJadwalRepositories = JadwalInterfaceRepository;
