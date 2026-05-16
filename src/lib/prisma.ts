import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import "dotenv/config"

const globalForPrisma = globalThis as typeof globalThis & {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL

  if (url?.startsWith("file:")) {
    const adapter = new PrismaBetterSqlite3({ url })
    return new PrismaClient({ adapter, log: ["error", "warn"] })
  }

  if (url) {
    return new PrismaClient({ accelerateUrl: url, log: ["error", "warn"] })
  }

  console.warn("DATABASE_URL not configured - Prisma will initialize on first query")
  return new PrismaClient({ log: ["error", "warn"] })
}

function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}

export const prisma = getPrisma()