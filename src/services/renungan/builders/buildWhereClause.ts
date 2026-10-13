import type { Prisma } from "../../../generated/prisma/client";
import type { RenunganListOptions } from "../data_interfaces/RenunganInterface";

/**
 * Pembangunan Prisma where filter untuk keyword search pada title dan description renungan.
 *
 * @param options Query parameter opsional: q
 * @returns Prisma.RenunganWhereInput
 */
export const buildWhereClause = (
  options?: RenunganListOptions,
): Prisma.RenunganWhereInput => {
  const where: Prisma.RenunganWhereInput = {};

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
    ];
  }

  return where;
};
