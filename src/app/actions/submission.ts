"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getSubmissions() {
  try {
    const { userId } = await auth()
    if (!userId) return []

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) return []

    return await prisma.submission.findMany({
      where: {
        OR: [
          {
            assignment: {
              course: {
                teacherId: user.id
              }
            }
          },
          {
            exam: {
              course: {
                teacherId: user.id
              }
            }
          }
        ]
      },
      include: {
        student: true,
        assignment: true,
        exam: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  } catch (error) {
    console.error("Error fetching submissions:", error)
    return []
  }
}

export async function getSubmission(id: string) {
  try {
    const { userId } = await auth()
    if (!userId) return null

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) return null

    return await prisma.submission.findUnique({
      where: { id },
      include: {
        student: true,
        assignment: {
          include: {
            course: true
          }
        },
        exam: {
          include: {
            course: true
          }
        },
        peerReviews: {
          include: {
            reviewer: { select: { name: true } }
          }
        }
      }
    })
  } catch (error) {
    console.error("Error fetching submission:", error)
    return null
  }
}
