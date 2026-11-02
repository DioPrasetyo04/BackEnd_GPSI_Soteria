import type { Prisma } from "../../../generated/prisma/client";
import type { UserSortOption } from "../data_interfaces/UserInterface";
/**
 * Pemetaan opsi pengurutan ke Prisma orderBy configuration dengan sorting sekunder deterministik (id).
 *
 * @param sort Opsi sort: newest | oldest | name_asc | name_desc | email_asc | email_desc
 * @returns Array Prisma.UserOrderByWithRelationInput
 */
export declare const buildOrderBy: (sort?: UserSortOption) => Prisma.UserOrderByWithRelationInput[];
//# sourceMappingURL=buildOrderBy.d.ts.map