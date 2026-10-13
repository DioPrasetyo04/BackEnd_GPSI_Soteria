import type { Prisma } from "../../../generated/prisma/client";
import type { GalleryQueryOptions } from "../data_interfaces/GalleryInterface";

/**
 * Pembangunan Prisma where filter untuk keyword search (title, category, alt).
 *
 * @param options Query parameter opsional: q, category
 * @returns Prisma.GalleryWhereInput
 */
export const buildWhereClause = (
  options?: GalleryQueryOptions,
): Prisma.GalleryWhereInput => {
  const where: Prisma.GalleryWhereInput = {};

  if (options?.category && options.category.trim().length > 0) {
    where.category = {
      equals: options.category.trim(),
      mode: "insensitive",
    };
  }

  if (options?.q && options.q.trim().length > 0) {
    const searchTerm = options.q.trim();
    where.OR = [
      {
        title: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        category: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        alt: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  return where;
};
