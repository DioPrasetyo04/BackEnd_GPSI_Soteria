import type { Prisma } from "../../../generated/prisma/client";
import type { RenunganSortOption } from "../data_interfaces/RenunganInterface";
/**
 * Pemetaan opsi pengurutan ke Prisma orderBy configuration dengan sorting sekunder deterministik (id).
 *
 * @param sort Opsi sort: newest | oldest | title_asc | title_desc
 * @returns Array Prisma.RenunganOrderByWithRelationInput
 */
export declare const buildOrderBy: (sort?: RenunganSortOption) => Prisma.RenunganOrderByWithRelationInput[];
//# sourceMappingURL=buildOrderBy.d.ts.map