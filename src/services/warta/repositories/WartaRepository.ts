import type { Prisma } from "../../../generated/prisma/client";
import type {
  WartaInterface,
  WartaQueryOptions,
  WartaPaginatedResult,
} from "../data_interfaces/WartaInterface";
import type { WartaInterfaceRepository } from "../interfaces/IWartaRepositories";
import { prisma } from "../../../config/database";
import {
  buildWhereClause,
  buildOrderBy,
  buildPaginationParams,
  buildPaginationMeta,
} from "../builders";

export class WartaRepositories implements WartaInterfaceRepository {
  async createWarta(data: Prisma.WartaCreateInput): Promise<WartaInterface> {
    return prisma.warta.create({ data });
  }

  async getWarta(slug: string): Promise<WartaInterface | null> {
    return prisma.warta.findUnique({ where: { slug } });
  }

  async getWartaById(id: string): Promise<WartaInterface | null> {
    return prisma.warta.findUnique({ where: { id } });
  }

  async getAllWarta(
    options?: WartaQueryOptions,
  ): Promise<WartaPaginatedResult> {
    const { page, limit, skip, take } = buildPaginationParams(
      options?.page,
      options?.limit,
    );
    const where = buildWhereClause(options);
    const orderBy = buildOrderBy(options?.sort);

    const [totalItems, items] = await prisma.$transaction([
      prisma.warta.count({ where }),
      prisma.warta.findMany({
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
      warta: items,
    };
  }

  async updateWarta(
    slug: string,
    data: Prisma.WartaUpdateInput,
  ): Promise<WartaInterface> {
    return prisma.warta.update({ where: { slug }, data });
  }

  async deleteWarta(slug: string): Promise<boolean> {
    const deleted = await prisma.warta.delete({ where: { slug } });
    return !!deleted;
  }
}
