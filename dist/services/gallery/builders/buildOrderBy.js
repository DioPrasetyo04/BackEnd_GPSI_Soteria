"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOrderBy = void 0;
/**
 * Pemetaan opsi pengurutan ke Prisma orderBy configuration dengan sorting sekunder deterministik (id).
 *
 * @param sort Opsi sort: newest | oldest | title_asc | title_desc
 * @returns Array Prisma.GalleryOrderByWithRelationInput
 */
const buildOrderBy = (sort) => {
    switch (sort) {
        case "oldest":
            return [{ date: "asc" }, { id: "asc" }];
        case "title_asc":
            return [{ title: "asc" }, { id: "asc" }];
        case "title_desc":
            return [{ title: "desc" }, { id: "desc" }];
        case "newest":
        default:
            return [{ date: "desc" }, { id: "desc" }];
    }
};
exports.buildOrderBy = buildOrderBy;
//# sourceMappingURL=buildOrderBy.js.map