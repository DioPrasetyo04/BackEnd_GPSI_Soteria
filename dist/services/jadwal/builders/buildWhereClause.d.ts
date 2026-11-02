import type { Prisma } from "../../../generated/prisma/client";
import type { JadwalQueryOptions } from "../data_interfaces/JadwalInterface";
/**
 * Pembangunan Prisma where filter menggabungkan keyword search dan date range filter.
 *
 * @param options Query parameter opsional: q, dateFrom, dateTo
 * @returns Prisma.JadwalWhereInput
 */
export declare const buildWhereClause: (options?: JadwalQueryOptions) => Prisma.JadwalWhereInput;
//# sourceMappingURL=buildWhereClause.d.ts.map