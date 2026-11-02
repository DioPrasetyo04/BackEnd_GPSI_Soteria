"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWhereClause = void 0;
/**
 * Pembangunan Prisma where filter untuk pencarian teks (name, position, phone)
 * dan penyaringan kategori organisasi (PENGURUS_HARIAN, KOORDINATOR_SEKTOR).
 *
 * @param options Query parameter opsional: q, category
 * @returns Prisma.OrganizationWhereInput
 */
const buildWhereClause = (options) => {
    const where = {};
    if (options?.category) {
        where.category = options.category;
    }
    if (options?.q && options.q.trim().length > 0) {
        const searchTerm = options.q.trim();
        where.OR = [
            {
                name: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            {
                position: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            {
                phone: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
        ];
    }
    return where;
};
exports.buildWhereClause = buildWhereClause;
//# sourceMappingURL=buildWhereClause.js.map