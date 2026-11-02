import type { Prisma } from "../../../generated/prisma/client";
import type { WartaQueryOptions } from "../data_interfaces/WartaInterface";
/**
 * Pembangunan Prisma where filter untuk keyword search pada title, description, dan slug warta.
 *
 * @param options Query parameter opsional: q
 * @returns Prisma.WartaWhereInput
 */
export declare const buildWhereClause: (options?: WartaQueryOptions) => Prisma.WartaWhereInput;
//# sourceMappingURL=buildWhereClause.d.ts.map