"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { updateStreak } from "./gamification"

export async function getStudentExams() {
  try {
    const { userId } = await auth()
    if (!userId) return []

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return []

    return await prisma.exam.findMany({
      where: {
        course: {
          enrollments: {
            some: {
              studentId: user.id
            }
          }
        }
      },
      include: {
        course: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  } catch (error) {
    console.error("Error fetching student exams:", error)
    return []
  }
}

export async function getStudentExam(examId: string) {
  try {
    const { userId } = await auth()
    if (!userId) return null

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return null

    const exam = await prisma.exam.findUnique({
      where: { id: examId, status: "PUBLISHED" },
      include: {
        course: true,
        questions: {
          orderBy: { order: "asc" }
        }
      }
    })

    if (!exam) return null

    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: user.id, courseId: exam.courseId } }
    })

    if (!enrollment) return null

    return exam
  } catch (error) {
    console.error("Error fetching student exam:", error)
    return null
  }
}

export async function submitWrittenExam(examId: string, answers: Record<string, string>) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) throw new Error("User not found")

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { course: true }
    })
    if (!exam) throw new Error("Exam not found")

    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: user.id, courseId: exam.courseId } }
    })
    if (!enrollment) throw new Error("Not enrolled in this course")

    await prisma.submission.create({
      data: {
        studentId: user.id,
        examId,
        answers,
        status: "PENDING"
      }
    })

    await updateStreak()

    revalidatePath(`/student/exams/${examId}`)
    return { success: true }
  } catch (error) {
    console.error("Error submitting written exam:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to submit exam" }
  }
}
