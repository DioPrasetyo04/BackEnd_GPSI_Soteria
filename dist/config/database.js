"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisconnectDatabase = exports.ConnectDatabase = exports.prisma = void 0;
require("dotenv/config");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
// Global cache singleton Prisma agar koneksi tidak exhaust di serverless
const globalForPrisma = globalThis;
function getPrismaClient() {
    if (globalForPrisma.prisma) {
        return globalForPrisma.prisma;
    }
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not defined in environment variables. Pastikan sudah mengisi DATABASE_URL di Vercel Project Settings.");
    }
    const adapter = new adapter_pg_1.PrismaPg({ connectionString });
    const client = new client_1.PrismaClient({ adapter });
    // Cache singleton di instance global (reused across warm invocations)
    globalForPrisma.prisma = client;
    return client;
}
// Lazy Proxy: mencegah serverless function crash saat startup / health check
const prisma = new Proxy({}, {
    get(_target, prop) {
        if (prop === "then" ||
            prop === "catch" ||
            prop === "finally" ||
            prop === "$$typeof" ||
            typeof prop === "symbol") {
            return undefined;
        }
        const client = getPrismaClient();
        const value = client[prop];
        if (typeof value === "function") {
            return value.bind(client);
        }
        return value;
    },
});
exports.prisma = prisma;
const ConnectDatabase = async () => {
    if (!process.env.DATABASE_URL) {
        console.warn("⚠️ DATABASE_URL is not defined in environment variables!");
        return;
    }
    try {
        const client = getPrismaClient();
        await client.$connect();
        console.log("Database Connected");
    }
    catch (error) {
        console.error("Database Connect Error:", error);
    }
};
exports.ConnectDatabase = ConnectDatabase;
const DisconnectDatabase = async () => {
    try {
        if (globalForPrisma.prisma) {
            await globalForPrisma.prisma.$disconnect();
            console.log("Database Disconnected");
        }
    }
    catch (error) {
        console.error("Database Disconnect Error:", error);
    }
};
exports.DisconnectDatabase = DisconnectDatabase;
//# sourceMappingURL=database.js.map