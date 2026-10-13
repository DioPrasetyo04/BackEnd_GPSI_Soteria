import type { Prisma } from "../../../generated/prisma/client";
import type { WartaSortOption } from "../data_interfaces/WartaInterface";

/**
 * Pemetaan opsi pengurutan ke Prisma orderBy configuration dengan sorting sekunder deterministik (id).
 *
 * @param sort Opsi sort: newest | oldest | title_asc | title_desc
 * @returns Array Prisma.WartaOrderByWithRelationInput
 */
export const buildOrderBy = (
  sort?: WartaSortOption,
): Prisma.WartaOrderByWithRelationInput[] => {
  switch (sort) {
    case "oldest":
      return [{ publishedAt: "asc" }, { id: "asc" }];
    case "title_asc":
      return [{ title: "asc" }, { id: "asc" }];
    case "title_desc":
      return [{ title: "desc" }, { id: "desc" }];
    case "newest":
    default:
      return [{ publishedAt: "desc" }, { id: "desc" }];
  }
};
