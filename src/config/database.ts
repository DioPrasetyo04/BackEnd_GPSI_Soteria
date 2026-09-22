import "dotenv/config";
import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if(!connectionString){
    throw new Error("DATABASE URL is not defined env");
}

const adapter = new PrismaPg({
    connectionString,
});

const prisma = new PrismaClient({
    adapter,
});

const ConnectDatabase = async (): Promise<void> => {
    try {
        await prisma.$connect();
        console.log("Database Connected");
    } catch (error) {
        console.error("Database Connect Error:", error);
        process.exit(1);
    }
};

const DisconnectDatabase = async() => {
    try {
        await prisma.$disconnect();
        console.log('Database Disconnected');
    } catch (error) {
        console.error("Database Disconnect Error:", error);
    }
};

export {
    prisma,
    ConnectDatabase,
    DisconnectDatabase
}