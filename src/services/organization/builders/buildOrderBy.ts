import type { Prisma } from "../../../generated/prisma/client";
import type { OrganizationSortOption } from "../data_interfaces/OrganizationInterface";

/**
 * Pemetaan opsi pengurutan ke Prisma orderBy configuration dengan sorting sekunder deterministik.
 *
 * @param sort Opsi sort: default | order_asc | order_desc | name_asc | name_desc | newest | oldest
 * @returns Array Prisma.OrganizationOrderByWithRelationInput
 */
export const buildOrderBy = (
  sort?: OrganizationSortOption,
): Prisma.OrganizationOrderByWithRelationInput[] => {
  switch (sort) {
    case "order_asc":
      return [{ order: "asc" }, { id: "asc" }];
    case "order_desc":
      return [{ order: "desc" }, { id: "asc" }];
    case "name_asc":
      return [{ name: "asc" }, { order: "asc" }, { id: "asc" }];
    case "name_desc":
      return [{ name: "desc" }, { order: "asc" }, { id: "asc" }];
    case "newest":
      return [{ createdAt: "desc" }, { id: "desc" }];
    case "oldest":
      return [{ createdAt: "asc" }, { id: "asc" }];
    case "default":
    default:
      return [{ category: "asc" }, { order: "asc" }, { id: "asc" }];
  }
};
