"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationMeta = exports.buildPaginationParams = void 0;
/**
 * Menghitung parameter offset pagination Prisma (skip & take).
 *
 * @param page Nomor halaman (default: 1)
 * @param limit Batas jumlah data per halaman (default: 10, max: 100)
 * @returns PaginationParams
 */
const buildPaginationParams = (page, limit) => {
    const normalizedPage = page && page > 0 ? page : 1;
    const normalizedLimit = limit && limit > 0 ? Math.min(limit, 100) : 10;
    const skip = (normalizedPage - 1) * normalizedLimit;
    const take = normalizedLimit;
    return {
        page: normalizedPage,
        limit: normalizedLimit,
        skip,
        take,
    };
};
exports.buildPaginationParams = buildPaginationParams;
/**
 * Menghasilkan metadata pagination standar berdasarkan total items yang ditemukan.
 *
 * @param totalItems Total record yang cocok
 * @param page Nomor halaman saat ini
 * @param limit Batas data per halaman
 * @returns PaginationMeta
 */
const buildPaginationMeta = (totalItems, page, limit) => {
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
exports.buildPaginationMeta = buildPaginationMeta;
//# sourceMappingURL=buildPagination.js.map