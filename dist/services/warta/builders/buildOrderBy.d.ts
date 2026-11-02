import type { Prisma } from "../../../generated/prisma/client";
import type { WartaSortOption } from "../data_interfaces/WartaInterface";
/**
 * Pemetaan opsi pengurutan ke Prisma orderBy configuration dengan sorting sekunder deterministik (id).
 *
 * @param sort Opsi sort: newest | oldest | title_asc | title_desc
 * @returns Array Prisma.WartaOrderByWithRelationInput
 */
export declare const buildOrderBy: (sort?: WartaSortOption) => Prisma.WartaOrderByWithRelationInput[];
//# sourceMappingURL=buildOrderBy.d.ts.map