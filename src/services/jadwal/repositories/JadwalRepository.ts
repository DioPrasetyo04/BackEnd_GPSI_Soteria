import type { Prisma } from "../../../generated/prisma/client";
import type {
  JadwalInterface,
  PaginatedJadwalResult,
  JadwalQueryOptions,
} from "../data_interfaces/JadwalInterface";
import type { JadwalInterfaceRepository } from "../interfaces/IJadwalRepositories";
import { prisma } from "../../../config/database";
import {
  buildWhereClause,
  buildOrderBy,
  buildPaginationParams,
  buildPaginationMeta,
} from "../builders";

export class JadwalRepositories implements JadwalInterfaceRepository {
  async createJadwal(data: Prisma.JadwalCreateInput): Promise<JadwalInterface> {
    return prisma.jadwal.create({ data });
  }

  async getJadwal(id: string): Promise<JadwalInterface | null> {
    return prisma.jadwal.findUnique({ where: { id } });
  }

  async getAllJadwal(
    options?: JadwalQueryOptions,
  ): Promise<PaginatedJadwalResult> {
    const { page, limit, skip, take } = buildPaginationParams(
      options?.page,
      options?.limit,
    );

    const where = buildWhereClause(options);
    const orderBy = buildOrderBy(options?.sort);

    const [totalItems, items] = await prisma.$transaction([
      prisma.jadwal.count({ where }),
      prisma.jadwal.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
    ]);

    const pagination = buildPaginationMeta(totalItems, page, limit);

    return {
      items,
      pagination,
      jadwal: items,
    };
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
