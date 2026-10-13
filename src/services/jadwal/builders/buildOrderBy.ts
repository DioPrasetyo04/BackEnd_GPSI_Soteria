import type { Prisma } from "../../../generated/prisma/client";
import type { JadwalSortOption } from "../data_interfaces/JadwalInterface";

/**
 * Pemetaan opsi pengurutan ke Prisma orderBy configuration dengan sorting sekunder deterministik (id).
 *
 * @param sort Opsi sort: upcoming | latest | activity_asc | activity_desc
 * @returns Array Prisma.JadwalOrderByWithRelationInput
 */
export const buildOrderBy = (
  sort?: JadwalSortOption,
): Prisma.JadwalOrderByWithRelationInput[] => {
  switch (sort) {
    case "upcoming":
      return [{ date: "asc" }, { id: "asc" }];
    case "latest":
      return [{ date: "desc" }, { id: "desc" }];
    case "activity_asc":
      return [{ activity: "asc" }, { id: "asc" }];
    case "activity_desc":
      return [{ activity: "desc" }, { id: "asc" }];
    default:
      return [{ date: "asc" }, { id: "asc" }];
  }
};
