"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositories = void 0;
const database_1 = require("../../../config/database");
const builders_1 = require("../builders");
class UserRepositories {
    async createUser(data) {
        return database_1.prisma.user.create({ data });
    }
    async getUser(id) {
        return database_1.prisma.user.findUnique({ where: { id } });
    }
    async getUserByEmail(email) {
        return database_1.prisma.user.findUnique({ where: { email } });
    }
    async getUserByApprovalToken(token) {
        return database_1.prisma.user.findUnique({ where: { approvalToken: token } });
    }
    async getAllUser() {
        return database_1.prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    async getUsers(options) {
        const where = (0, builders_1.buildWhereClause)(options);
        const orderBy = (0, builders_1.buildOrderBy)(options?.sort);
        const { skip, take } = (0, builders_1.buildPaginationParams)(options?.page, options?.limit);
        const [items, totalItems] = await Promise.all([
            database_1.prisma.user.findMany({
                where,
                orderBy,
                skip,
                take,
            }),
            database_1.prisma.user.count({ where }),
        ]);
        return { items, totalItems };
    }
    async updateUser(id, data) {
        return database_1.prisma.user.update({ where: { id }, data });
    }
    async deleteUser(id) {
        const deleted = await database_1.prisma.user.delete({ where: { id } });
        return !!deleted;
    }
    async countUser(where) {
        return database_1.prisma.user.count({ where });
    }
}
exports.UserRepositories = UserRepositories;
//# sourceMappingURL=UserRpositories.js.map