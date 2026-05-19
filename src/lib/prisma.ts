import { PrismaClient } from "@/generated/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Prisma 7 (prisma-client generator) requires accelerateUrl in the constructor.
// This is the direct database connection URL — the same value as DATABASE_URL.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL!,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
