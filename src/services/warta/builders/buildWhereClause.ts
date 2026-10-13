import type { Prisma } from "../../../generated/prisma/client";
import type { WartaQueryOptions } from "../data_interfaces/WartaInterface";

/**
 * Pembangunan Prisma where filter untuk keyword search pada title, description, dan slug warta.
 *
 * @param options Query parameter opsional: q
 * @returns Prisma.WartaWhereInput
 */
export const buildWhereClause = (
  options?: WartaQueryOptions,
): Prisma.WartaWhereInput => {
  const where: Prisma.WartaWhereInput = {};

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
        description: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        slug: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  return where;
};
