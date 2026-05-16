import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Clerk
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn().mockResolvedValue({ userId: 'user_123' }),
}))

// Auto-mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  notFound: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Cached Prisma mock — returns stable vi.fn() instances so mockResolvedValue/mockReturnValue persist
function createCachedPrismaMock(): any {
  const cache = new Map<string, any>()

  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      if (typeof prop === 'string' && (prop === 'constructor' || prop.startsWith('$$') || prop === 'then')) return undefined
      const key = String(prop)
      if (!cache.has(key)) {
        cache.set(key, new Proxy({}, deepHandler(key)))
      }
      return cache.get(key)
    }
  }

  const deepHandler = (parentKey: string): ProxyHandler<any> => ({
    get(_target, prop) {
      if (typeof prop === 'string' && (prop === 'constructor' || prop.startsWith('$$') || prop === 'then')) return undefined
      const key = `${parentKey}.${String(prop)}`
      if (!cache.has(key)) {
        if (['create', 'findUnique', 'findMany', 'findFirst', 'update', 'delete', 'upsert', 'count', 'aggregate', 'groupBy'].includes(prop as string)) {
          cache.set(key, vi.fn())
        } else {
          cache.set(key, new Proxy({}, deepHandler(key)))
        }
      }
      return cache.get(key)
    }
  })

  return new Proxy({}, handler)
}

vi.mock('@/lib/prisma', () => ({
  prisma: createCachedPrismaMock(),
}))
