"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOrderBy = void 0;
/**
 * Pemetaan opsi pengurutan ke Prisma orderBy configuration dengan sorting sekunder deterministik (id).
 *
 * @param sort Opsi sort: newest | oldest | name_asc | name_desc | email_asc | email_desc
 * @returns Array Prisma.UserOrderByWithRelationInput
 */
const buildOrderBy = (sort) => {
    switch (sort) {
        case "oldest":
            return [{ createdAt: "asc" }, { id: "asc" }];
        case "name_asc":
            return [{ name: "asc" }, { id: "asc" }];
        case "name_desc":
            return [{ name: "desc" }, { id: "desc" }];
        case "email_asc":
            return [{ email: "asc" }, { id: "asc" }];
        case "email_desc":
            return [{ email: "desc" }, { id: "desc" }];
        case "newest":
        default:
            return [{ createdAt: "desc" }, { id: "desc" }];
    }
};
exports.buildOrderBy = buildOrderBy;
//# sourceMappingURL=buildOrderBy.js.map