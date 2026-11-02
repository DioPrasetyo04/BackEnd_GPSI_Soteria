"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWhereClause = void 0;
/**
 * Pembangunan Prisma where filter untuk keyword search (name, email).
 *
 * @param options Query parameter opsional: q
 * @returns Prisma.UserWhereInput
 */
const buildWhereClause = (options) => {
    const where = {};
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
                email: {
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