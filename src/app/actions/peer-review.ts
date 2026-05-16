"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function getPeerReviewTask() {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return null

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true }
    })
    if (!user) return null

    const activePeerReviewAssignments = await prisma.assignment.findMany({
      where: {
        peerReviewEnabled: true,
        course: {
          enrollments: {
            some: { studentId: user.id }
          }
        }
      },
      include: {
        submissions: {
          where: {
            studentId: { not: user.id },
            status: "PENDING",
            peerReviews: {
              none: { reviewerId: user.id }
            }
          },
          take: 1,
          include: {
            student: { select: { name: true } }
          }
        }
      }
    })

    for (const assignment of activePeerReviewAssignments) {
      if (assignment.submissions.length > 0) {
        return {
          assignmentTitle: assignment.title,
          submission: assignment.submissions[0]
        }
      }
    }

    return null
  } catch (error) {
    console.error("Error fetching peer review task:", error)
    return null
  }
}

export async function submitPeerReview(submissionId: string, score: number, feedback: string) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return { success: false, error: "Unauthorized" }

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) return { success: false, error: "User not found" }

  try {
    await prisma.peerReview.create({
      data: {
        reviewerId: user.id,
        submissionId,
        score,
        feedback,
        status: "COMPLETED"
      }
    })

    // Award points for participating in peer review
    await prisma.user.update({
      where: { id: user.id },
      data: { points: { increment: 30 } }
    })

    revalidatePath("/student/dashboard")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
