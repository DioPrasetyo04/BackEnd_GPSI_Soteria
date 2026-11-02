"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRepositories = void 0;
const database_1 = require("../../../config/database");
class OrganizationRepositories {
    async createOrganization(data) {
        return database_1.prisma.organization.create({ data });
    }
    async getOrganization(id) {
        return database_1.prisma.organization.findUnique({ where: { id } });
    }
    async getAllOrganizations(category) {
        return database_1.prisma.organization.findMany({
            where: category ? { category } : undefined,
            orderBy: [{ category: "asc" }, { order: "asc" }],
        });
    }
    async updateOrganization(id, data) {
        return database_1.prisma.organization.update({ where: { id }, data });
    }
    async deleteOrganization(id) {
        const deleted = await database_1.prisma.organization.delete({ where: { id } });
        return !!deleted;
    }
    async countOrganization(where) {
        return database_1.prisma.organization.count({ where });
    }
}
exports.OrganizationRepositories = OrganizationRepositories;
//# sourceMappingURL=OrganizationRepository.js.map