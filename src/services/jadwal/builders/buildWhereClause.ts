import type { Prisma } from "../../../generated/prisma/client";
import type { JadwalQueryOptions } from "../data_interfaces/JadwalInterface";

/**
 * Pembangunan Prisma where filter menggabungkan keyword search dan date range filter.
 *
 * @param options Query parameter opsional: q, dateFrom, dateTo
 * @returns Prisma.JadwalWhereInput
 */
export const buildWhereClause = (
  options?: JadwalQueryOptions,
): Prisma.JadwalWhereInput => {
  const where: Prisma.JadwalWhereInput = {};

  if (options?.dateFrom || options?.dateTo) {
    where.date = {};
    if (options.dateFrom) {
      where.date.gte = new Date(`${options.dateFrom}T00:00:00.000Z`);
    }
    if (options.dateTo) {
      where.date.lte = new Date(`${options.dateTo}T00:00:00.000Z`);
    }
  }

  if (options?.q && options.q.trim().length > 0) {
    const searchTerm = options.q.trim();
    where.OR = [
      { activity: { contains: searchTerm, mode: "insensitive" } },
      { organizer: { contains: searchTerm, mode: "insensitive" } },
      { location: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  return where;
};
