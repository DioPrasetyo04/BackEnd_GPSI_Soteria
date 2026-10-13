import type { Prisma } from "../../../generated/prisma/client";
import type { UserSortOption } from "../data_interfaces/UserInterface";

/**
 * Pemetaan opsi pengurutan ke Prisma orderBy configuration dengan sorting sekunder deterministik (id).
 *
 * @param sort Opsi sort: newest | oldest | name_asc | name_desc | email_asc | email_desc
 * @returns Array Prisma.UserOrderByWithRelationInput
 */
export const buildOrderBy = (
  sort?: UserSortOption,
): Prisma.UserOrderByWithRelationInput[] => {
  switch (sort) {
    case "oldest":
      return [{ createdAt: "asc" }, { id: "asc" }];
    case "name_asc":
      return [{ name: "asc" }, { id: "asc" }];
    case "name_desc":
      return [{ name: "desc" }, { id: "desc" }];
    case "email_asc":
      return [{ email: "asc" }, { id: "asc" }];
    case "email_desc":
      return [{ email: "desc" }, { id: "desc" }];
    case "newest":
    default:
      return [{ createdAt: "desc" }, { id: "desc" }];
  }
};
