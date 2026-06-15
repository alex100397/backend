import { PrismaClient } from "../generated/prisma/index.js";
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully!");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1); // Exit the process with an error code
    }
}

const disconnectDB = async () => {
    try {
        await prisma.$disconnect();
        console.log("Disconnected from the database successfully!");
    } catch (error) {
        console.error("Error disconnecting from the database:", error);
    }
}

export { prisma, connectDB, disconnectDB };