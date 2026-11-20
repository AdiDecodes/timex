import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient;
  isDbOnline: boolean;
};

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma;
} else {
  const mockAdapter = {
    provider: "mysql",
    query: () => Promise.resolve({ rows: [] }),
    execute: () => Promise.resolve({ rowsAffected: 0 }),
    transaction: () => Promise.resolve(),
  } as any;

  prisma = new PrismaClient({ adapter: mockAdapter });
  globalForPrisma.isDbOnline = false;

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
}

export { prisma };

export function getDbStatus(): boolean {
  return false;
}
