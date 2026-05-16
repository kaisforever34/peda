"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"

export async function autoGradeSubmission(submissionId: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user || user.role !== "TEACHER") throw new Error("Forbidden")

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      select: {
        assignment: { select: { course: { select: { teacherId: true } } } },
        exam: { select: { course: { select: { teacherId: true } } } }
      }
    })
    if (!submission) throw new Error("Submission not found")
    const teacherId = submission.assignment?.course.teacherId || submission.exam?.course.teacherId
    if (teacherId !== user.id) throw new Error("You do not have permission to grade this submission")

    // Mock AI Grading Logic
    const aiScore = Math.floor(Math.random() * 40) + 60;
    const aiFeedback = aiScore > 85 
      ? "Excellent work! Your points were clear and well-structured. Good use of vocabulary."
      : "Good effort, but you missed some key concepts. Please review the material on the core subjects.";

    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        aiScore,
        aiFeedback,
        status: "AI_REVIEWED"
      }
    });

    revalidatePath("/teacher/submissions");
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function gradeSubmission(submissionId: string, score: number, feedback: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user || user.role !== "TEACHER") throw new Error("Forbidden")

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      select: {
        assignment: { select: { course: { select: { teacherId: true } } } },
        exam: { select: { course: { select: { teacherId: true } } } }
      }
    })
    if (!submission) throw new Error("Submission not found")
    const teacherId = submission.assignment?.course.teacherId || submission.exam?.course.teacherId
    if (teacherId !== user.id) throw new Error("You do not have permission to grade this submission")

    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        teacherScore: score,
        teacherFeedback: feedback,
        status: "GRADED",
        reviewed: true
      }
    })

    revalidatePath("/teacher/submissions")
    revalidatePath(`/teacher/submissions/${submissionId}`)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
