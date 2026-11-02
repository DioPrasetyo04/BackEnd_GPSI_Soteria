"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepositories = void 0;
const database_1 = require("../../../config/database");
class AuthRepositories {
    async saveSession(userId, token, expiresAt) {
        await database_1.prisma.authentication.upsert({
            where: {
                userId,
            },
            update: {
                token,
                expiresAt,
            },
            create: {
                userId,
                token,
                expiresAt,
            },
        });
        return {
            userId,
            token,
            expiresAt,
        };
    }
    async findByUserId(userId) {
        const session = await database_1.prisma.authentication.findUnique({
            where: { userId },
        });
        if (!session) {
            return null;
        }
        return {
            userId: session.userId,
            token: session.token,
            expiresAt: session.expiresAt,
        };
    }
    async logout(tokenOrUserId) {
        await database_1.prisma.authentication.deleteMany({
            where: {
                OR: [{ token: tokenOrUserId }, { userId: tokenOrUserId }],
            },
        });
    }
}
exports.AuthRepositories = AuthRepositories;
//# sourceMappingURL=AuthRepositories.js.map