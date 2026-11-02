import type { Prisma } from "../../../generated/prisma/client";
import type { JadwalSortOption } from "../data_interfaces/JadwalInterface";
/**
 * Pemetaan opsi pengurutan ke Prisma orderBy configuration dengan sorting sekunder deterministik (id).
 *
 * @param sort Opsi sort: upcoming | latest | activity_asc | activity_desc
 * @returns Array Prisma.JadwalOrderByWithRelationInput
 */
export declare const buildOrderBy: (sort?: JadwalSortOption) => Prisma.JadwalOrderByWithRelationInput[];
//# sourceMappingURL=buildOrderBy.d.ts.map