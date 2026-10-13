import type { Prisma } from "../../../generated/prisma/client";
import type {
  Renungan,
  RenunganListOptions,
  RenunganPaginatedResult,
} from "../data_interfaces/RenunganInterface";
import type { RenunganInterfaceRepository } from "../interfaces/IRenunganRepositories";
import { prisma } from "../../../config/database";
import {
  buildWhereClause,
  buildOrderBy,
  buildPaginationParams,
  buildPaginationMeta,
} from "../builders";

export class RenunganRepositories implements RenunganInterfaceRepository {
  async createRenungan(data: Prisma.RenunganCreateInput): Promise<Renungan> {
    return prisma.renungan.create({
      data,
    });
  }

  async getRenungan(slug: string): Promise<Renungan | null> {
    return prisma.renungan.findUnique({
      where: {
        slug,
      },
    });
  }

  async getAllRenungan(
    options?: RenunganListOptions,
  ): Promise<RenunganPaginatedResult> {
    const { page, limit, skip, take } = buildPaginationParams(
      options?.page,
      options?.limit,
    );
    const where = buildWhereClause(options);
    const orderBy = buildOrderBy(options?.sort);

    const [totalItems, items] = await prisma.$transaction([
      prisma.renungan.count({ where }),
      prisma.renungan.findMany({
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
    };
  }

  async updateRenungan(
    slug: string,
    data: Prisma.RenunganUpdateInput,
  ): Promise<Renungan> {
    return prisma.renungan.update({
      where: {
        slug,
      },
      data,
    });
  }

  async deleteRenungan(slug: string): Promise<boolean> {
    const deleteRenungan = await prisma.renungan.delete({
      where: {
        slug,
      },
    });
    return !!deleteRenungan;
  }
}

