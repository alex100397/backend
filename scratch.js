import { PrismaClient } from "./src/generated/prisma/index.js";
try {
  const prisma = new PrismaClient({});
  console.log("Success with empty object");
} catch (e) {
  console.error("Error with empty object:", e);
}
