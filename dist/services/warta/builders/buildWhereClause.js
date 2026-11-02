"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWhereClause = void 0;
/**
 * Pembangunan Prisma where filter untuk keyword search pada title, description, dan slug warta.
 *
 * @param options Query parameter opsional: q
 * @returns Prisma.WartaWhereInput
 */
const buildWhereClause = (options) => {
    const where = {};
    if (options?.q && options.q.trim().length > 0) {
        const searchTerm = options.q.trim();
        where.OR = [
            {
                title: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            {
                description: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            {
                slug: {
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