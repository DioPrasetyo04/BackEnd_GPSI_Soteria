import type { Prisma } from "../../../generated/prisma/client";
import type { GallerySortOption } from "../data_interfaces/GalleryInterface";

/**
 * Pemetaan opsi pengurutan ke Prisma orderBy configuration dengan sorting sekunder deterministik (id).
 *
 * @param sort Opsi sort: newest | oldest | title_asc | title_desc
 * @returns Array Prisma.GalleryOrderByWithRelationInput
 */
export const buildOrderBy = (
  sort?: GallerySortOption,
): Prisma.GalleryOrderByWithRelationInput[] => {
  switch (sort) {
    case "oldest":
      return [{ date: "asc" }, { id: "asc" }];
    case "title_asc":
      return [{ title: "asc" }, { id: "asc" }];
    case "title_desc":
      return [{ title: "desc" }, { id: "desc" }];
    case "newest":
    default:
      return [{ date: "desc" }, { id: "desc" }];
  }
};
