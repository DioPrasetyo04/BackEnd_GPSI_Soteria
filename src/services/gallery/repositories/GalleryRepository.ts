import type { Prisma } from "../../../generated/prisma/client";
import type {
  GalleryInterface,
  GalleryQueryOptions,
  PaginatedGalleryResult,
} from "../data_interfaces/GalleryInterface";
import type { GalleryInterfaceRepository } from "../interfaces/IGalleryRepositories";
import { prisma } from "../../../config/database";
import {
  buildWhereClause,
  buildOrderBy,
  buildPaginationParams,
  buildPaginationMeta,
} from "../builders";

export class GalleryRepositories implements GalleryInterfaceRepository {
  async createGallery(
    data: Prisma.GalleryCreateInput,
  ): Promise<GalleryInterface> {
    return prisma.gallery.create({ data });
  }

  async getGallery(id: string): Promise<GalleryInterface | null> {
    return prisma.gallery.findUnique({ where: { id } });
  }

  async getAllGallery(
    options?: GalleryQueryOptions,
  ): Promise<PaginatedGalleryResult> {
    const { page, limit, skip, take } = buildPaginationParams(
      options?.page,
      options?.limit,
    );
    const where = buildWhereClause(options);
    const orderBy = buildOrderBy(options?.sort);

    const [totalItems, items] = await prisma.$transaction([
      prisma.gallery.count({ where }),
      prisma.gallery.findMany({
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
      gallery: items,
    };
  }

  async updateGallery(
    id: string,
    data: Prisma.GalleryUpdateInput,
  ): Promise<GalleryInterface> {
    return prisma.gallery.update({ where: { id }, data });
  }

  async deleteGallery(id: string): Promise<boolean> {
    const deleted = await prisma.gallery.delete({ where: { id } });
    return !!deleted;
  }
}
