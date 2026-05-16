"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getAllUsers(page: number = 1, limit: number = 10) {
  try {
    const { userId } = await auth()
    if (!userId) return { users: [], total: 0, pages: 0 }

    const requester = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (requester?.role !== "ADMIN") return { users: [], total: 0, pages: 0 }

    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        include: {
          _count: {
            select: {
              teachingCourses: true,
              learningCourses: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.user.count()
    ])

    return { 
      users, 
      total, 
      pages: Math.ceil(total / limit),
      currentPage: page
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { users: [], total: 0, pages: 0 }
  }
}
