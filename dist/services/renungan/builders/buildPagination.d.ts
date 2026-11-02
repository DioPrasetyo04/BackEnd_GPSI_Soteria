import type { PaginationMeta } from "../data_interfaces/RenunganInterface";
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
 * @returns PaginationMeta
 */
export declare const buildPaginationMeta: (totalItems: number, page: number, limit: number) => PaginationMeta;
//# sourceMappingURL=buildPagination.d.ts.map