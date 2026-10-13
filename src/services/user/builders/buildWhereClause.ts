import type { Prisma } from "../../../generated/prisma/client";
import type { UserQueryOptions } from "../data_interfaces/UserInterface";

/**
 * Pembangunan Prisma where filter untuk keyword search (name, email).
 *
 * @param options Query parameter opsional: q
 * @returns Prisma.UserWhereInput
 */
export const buildWhereClause = (
  options?: UserQueryOptions,
): Prisma.UserWhereInput => {
  const where: Prisma.UserWhereInput = {};

  if (options?.q && options.q.trim().length > 0) {
    const searchTerm = options.q.trim();
    where.OR = [
      {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  return where;
};
