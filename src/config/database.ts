import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

const adapter = connectionString
  ? new PrismaPg({ connectionString })
  : undefined;

// Pattern singleton untuk serverless / development agar koneksi tidak exhaust
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  (adapter
    ? new PrismaClient({ adapter })
    : new PrismaClient());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const ConnectDatabase = async (): Promise<void> => {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️ DATABASE_URL is not defined in environment variables!");
    return;
  }
  try {
    await prisma.$connect();
    console.log("Database Connected");
  } catch (error) {
    console.error("Database Connect Error:", error);
    // Jangan gunakan process.exit(1) di lingkungan serverless!
  }
};

const DisconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log("Database Disconnected");
  } catch (error) {
    console.error("Database Disconnect Error:", error);
  }
};

export { prisma, ConnectDatabase, DisconnectDatabase };
