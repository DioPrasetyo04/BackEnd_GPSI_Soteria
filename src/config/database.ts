import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Global cache singleton Prisma agar koneksi tidak exhaust di serverless
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not defined in environment variables. Pastikan sudah mengisi DATABASE_URL di Vercel Project Settings.",
    );
  }

  const adapter = new PrismaPg({ connectionString });
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

// Lazy Proxy: mencegah serverless function crash saat startup / health check
const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

const ConnectDatabase = async (): Promise<void> => {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️ DATABASE_URL is not defined in environment variables!");
    return;
  }
  try {
    const client = getPrismaClient();
    await client.$connect();
    console.log("Database Connected");
  } catch (error) {
    console.error("Database Connect Error:", error);
  }
};

const DisconnectDatabase = async (): Promise<void> => {
  try {
    if (globalForPrisma.prisma) {
      await globalForPrisma.prisma.$disconnect();
      console.log("Database Disconnected");
    }
  } catch (error) {
    console.error("Database Disconnect Error:", error);
  }
};

export { prisma, ConnectDatabase, DisconnectDatabase };
