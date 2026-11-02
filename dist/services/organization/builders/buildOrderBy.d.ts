import type { Prisma } from "../../../generated/prisma/client";
import type { OrganizationSortOption } from "../data_interfaces/OrganizationInterface";
/**
 * Pemetaan opsi pengurutan ke Prisma orderBy configuration dengan sorting sekunder deterministik.
 *
 * @param sort Opsi sort: default | order_asc | order_desc | name_asc | name_desc | newest | oldest
 * @returns Array Prisma.OrganizationOrderByWithRelationInput
 */
export declare const buildOrderBy: (sort?: OrganizationSortOption) => Prisma.OrganizationOrderByWithRelationInput[];
//# sourceMappingURL=buildOrderBy.d.ts.map