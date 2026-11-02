import type { Prisma } from "../../../generated/prisma/client";
import type { OrganizationQueryOptions } from "../data_interfaces/OrganizationInterface";
/**
 * Pembangunan Prisma where filter untuk pencarian teks (name, position, phone)
 * dan penyaringan kategori organisasi (PENGURUS_HARIAN, KOORDINATOR_SEKTOR).
 *
 * @param options Query parameter opsional: q, category
 * @returns Prisma.OrganizationWhereInput
 */
export declare const buildWhereClause: (options?: OrganizationQueryOptions) => Prisma.OrganizationWhereInput;
//# sourceMappingURL=buildWhereClause.d.ts.map