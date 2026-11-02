"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWhereClause = void 0;
/**
 * Pembangunan Prisma where filter menggabungkan keyword search dan date range filter.
 *
 * @param options Query parameter opsional: q, dateFrom, dateTo
 * @returns Prisma.JadwalWhereInput
 */
const buildWhereClause = (options) => {
    const where = {};
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
exports.buildWhereClause = buildWhereClause;
//# sourceMappingURL=buildWhereClause.js.map