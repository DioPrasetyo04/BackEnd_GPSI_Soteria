"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWhereClause = void 0;
/**
 * Pembangunan Prisma where filter untuk keyword search (title, category, alt).
 *
 * @param options Query parameter opsional: q, category
 * @returns Prisma.GalleryWhereInput
 */
const buildWhereClause = (options) => {
    const where = {};
    if (options?.category && options.category.trim().length > 0) {
        where.category = {
            equals: options.category.trim(),
            mode: "insensitive",
        };
    }
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
                category: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            {
                alt: {
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