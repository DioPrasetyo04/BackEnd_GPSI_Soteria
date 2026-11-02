"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOrderBy = void 0;
/**
 * Pemetaan opsi pengurutan ke Prisma orderBy configuration dengan sorting sekunder deterministik (id).
 *
 * @param sort Opsi sort: upcoming | latest | activity_asc | activity_desc
 * @returns Array Prisma.JadwalOrderByWithRelationInput
 */
const buildOrderBy = (sort) => {
    switch (sort) {
        case "upcoming":
            return [{ date: "asc" }, { id: "asc" }];
        case "latest":
            return [{ date: "desc" }, { id: "desc" }];
        case "activity_asc":
            return [{ activity: "asc" }, { id: "asc" }];
        case "activity_desc":
            return [{ activity: "desc" }, { id: "asc" }];
        default:
            return [{ date: "asc" }, { id: "asc" }];
    }
};
exports.buildOrderBy = buildOrderBy;
//# sourceMappingURL=buildOrderBy.js.map