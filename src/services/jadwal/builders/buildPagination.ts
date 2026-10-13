import type { PaginationMetadata } from "../data_interfaces/JadwalInterface";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

/**
 * Menghitung parameter offset pagination Prisma (skip & take).
 *
 * @param page Nomor halaman (default: 1)
 * @param limit Batas jumlah data per halaman (default: 10)
 * @returns PaginationParams
 */
export const buildPaginationParams = (
  page?: number,
  limit?: number,
): PaginationParams => {
  const normalizedPage = page && page > 0 ? page : 1;
  const normalizedLimit = limit && limit > 0 ? limit : 10;
  const skip = (normalizedPage - 1) * normalizedLimit;
  const take = normalizedLimit;

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip,
    take,
  };
};

/**
 * Menghasilkan metadata pagination standar berdasarkan total items yang ditemukan.
 *
 * @param totalItems Total record yang cocok
 * @param page Nomor halaman saat ini
 * @param limit Batas data per halaman
 * @returns PaginationMetadata
 */
export const buildPaginationMeta = (
  totalItems: number,
  page: number,
  limit: number,
): PaginationMetadata => {
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1 && totalPages > 0;

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};
