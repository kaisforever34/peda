import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as typeof globalThis & {
  prisma: PrismaClient
}

function buildNullProxy(): PrismaClient {
  const returnValues: Record<string, any> = {
    findUnique: null,
    findFirst: null,
    findFirstOrThrow: null,
    findMany: [],
    unique: null,
    count: 0,
    aggregate: null,
    groupBy: [],
    create: null,
    update: null,
    upsert: null,
    delete: null,
    deleteMany: { count: 0 },
    updateMany: { count: 0 },
    createMany: { count: 0 },
  }

  function makeHandler() {
    return {
      get(_target: any, prop: string | symbol) {
        if (prop === "then" || prop === Symbol.toPrimitive || prop === "constructor" || prop === "prototype") return undefined
        const key = String(prop)
        if (key in returnValues) {
          const val = returnValues[key]
          if (key === "$transaction") {
            return (fn: any) => Promise.resolve(fn ? fn(buildNullProxy()) : null)
          }
          return () => Promise.resolve(val)
        }
        return buildNullProxy()
      },
      apply(_target: any, _thisArg: any, args: any[]) {
        if (typeof args[0] === "function") {
          return Promise.resolve(args[0](buildNullProxy()))
        }
        return Promise.resolve(null)
      },
    }
  }

  const fn = function () {} as any
  fn.__nullProxy = true
  return new Proxy(fn, makeHandler()) as unknown as PrismaClient
}

function tryCreatePrismaClient(): PrismaClient | null {
  try {
    const url = process.env.DATABASE_URL
    if (!url) return null

    if (url.startsWith("file:")) {
      try {
        const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3")
        const adapter = new PrismaBetterSqlite3({ url })
        return new PrismaClient({ adapter, log: ["error", "warn"] })
      } catch (e) {
        console.warn("Failed to create SQLite adapter, using null proxy:", e)
        return null
      }
    }

    // For non-SQLite URLs, try with accelerateUrl or adapter
    try {
      return new PrismaClient({ accelerateUrl: url, log: ["error", "warn"] })
    } catch (e) {
      console.warn("Failed to create PrismaClient with accelerateUrl, using null proxy:", e)
      return null
    }
  } catch (e) {
    console.warn("Failed to create PrismaClient, using null proxy:", e)
    return null
  }
}

function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const client = tryCreatePrismaClient()
    globalForPrisma.prisma = client ?? buildNullProxy()
  }
  return globalForPrisma.prisma
}

export const prisma: PrismaClient = getPrisma()
