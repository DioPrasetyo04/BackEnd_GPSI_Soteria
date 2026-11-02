import type { Prisma } from "../../../generated/prisma/client";
import type { UserQueryOptions } from "../data_interfaces/UserInterface";
/**
 * Pembangunan Prisma where filter untuk keyword search (name, email).
 *
 * @param options Query parameter opsional: q
 * @returns Prisma.UserWhereInput
 */
export declare const buildWhereClause: (options?: UserQueryOptions) => Prisma.UserWhereInput;
//# sourceMappingURL=buildWhereClause.d.ts.map