import type { Prisma } from "../../../generated/prisma/client";
import type { RenunganListOptions } from "../data_interfaces/RenunganInterface";
/**
 * Pembangunan Prisma where filter untuk keyword search pada title dan description renungan.
 *
 * @param options Query parameter opsional: q
 * @returns Prisma.RenunganWhereInput
 */
export declare const buildWhereClause: (options?: RenunganListOptions) => Prisma.RenunganWhereInput;
//# sourceMappingURL=buildWhereClause.d.ts.map