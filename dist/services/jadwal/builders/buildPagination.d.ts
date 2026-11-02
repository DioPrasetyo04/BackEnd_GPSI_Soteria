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
export declare const buildPaginationParams: (page?: number, limit?: number) => PaginationParams;
/**
 * Menghasilkan metadata pagination standar berdasarkan total items yang ditemukan.
 *
 * @param totalItems Total record yang cocok
 * @param page Nomor halaman saat ini
 * @param limit Batas data per halaman
 * @returns PaginationMetadata
 */
export declare const buildPaginationMeta: (totalItems: number, page: number, limit: number) => PaginationMetadata;
//# sourceMappingURL=buildPagination.d.ts.map