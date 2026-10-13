import type { Prisma } from "../../../generated/prisma/client";
import type { RenunganSortOption } from "../data_interfaces/RenunganInterface";

/**
 * Pemetaan opsi pengurutan ke Prisma orderBy configuration dengan sorting sekunder deterministik (id).
 *
 * @param sort Opsi sort: newest | oldest | title_asc | title_desc
 * @returns Array Prisma.RenunganOrderByWithRelationInput
 */
export const buildOrderBy = (
  sort?: RenunganSortOption,
): Prisma.RenunganOrderByWithRelationInput[] => {
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
