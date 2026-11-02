import type { Prisma } from "../../../generated/prisma/client";
import type { GallerySortOption } from "../data_interfaces/GalleryInterface";
/**
 * Pemetaan opsi pengurutan ke Prisma orderBy configuration dengan sorting sekunder deterministik (id).
 *
 * @param sort Opsi sort: newest | oldest | title_asc | title_desc
 * @returns Array Prisma.GalleryOrderByWithRelationInput
 */
export declare const buildOrderBy: (sort?: GallerySortOption) => Prisma.GalleryOrderByWithRelationInput[];
//# sourceMappingURL=buildOrderBy.d.ts.map