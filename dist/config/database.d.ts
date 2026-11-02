import "dotenv/config";
import { PrismaClient } from "@prisma/client";
declare const prisma: PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/client").DefaultArgs>;
declare const ConnectDatabase: () => Promise<void>;
declare const DisconnectDatabase: () => Promise<void>;
export { prisma, ConnectDatabase, DisconnectDatabase };
//# sourceMappingURL=database.d.ts.map