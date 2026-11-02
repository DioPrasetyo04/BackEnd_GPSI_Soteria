import type { Prisma } from "../../../generated/prisma/client";
import type { GalleryQueryOptions } from "../data_interfaces/GalleryInterface";
/**
 * Pembangunan Prisma where filter untuk keyword search (title, category, alt).
 *
 * @param options Query parameter opsional: q, category
 * @returns Prisma.GalleryWhereInput
 */
export declare const buildWhereClause: (options?: GalleryQueryOptions) => Prisma.GalleryWhereInput;
//# sourceMappingURL=buildWhereClause.d.ts.map