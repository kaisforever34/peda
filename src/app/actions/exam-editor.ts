"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"

export async function addExamQuestion(examId: string, formData: FormData) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user || user.role !== "TEACHER") throw new Error("Forbidden: Teacher access required")

    const exam = await prisma.exam.findUnique({ where: { id: examId }, include: { course: true } })
    if (!exam || exam.course.teacherId !== user.id) {
      throw new Error("Forbidden: You do not own this exam")
    }

    const question = formData.get("question") as string
    const points = parseInt(formData.get("points") as string) || 1
    const type = formData.get("type") as string
    const answer = formData.get("answer") as string

    await prisma.examQuestion.create({
      data: {
        examId,
        question,
        points,
        type,
        answer,
        order: 0,
      }
    })

    revalidatePath(`/teacher/exams/${examId}`)
    return { success: true }
  } catch (error) {
    console.error("Error adding exam question:", error)
    throw error
  }
}

export async function deleteExamQuestion(questionId: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user || user.role !== "TEACHER") throw new Error("Forbidden: Teacher access required")

    const question = await prisma.examQuestion.findUnique({
      where: { id: questionId },
      include: { exam: { include: { course: true } } }
    })
    if (!question || question.exam.course.teacherId !== user.id) {
      throw new Error("Forbidden: You do not own this exam")
    }

    await prisma.examQuestion.delete({ where: { id: questionId } })

    revalidatePath(`/teacher/exams/${question.examId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting exam question:", error)
    throw error
  }
}

export async function getExamWithQuestions(examId: string) {
  try {
    return await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        questions: {
          orderBy: { order: "asc" }
        },
        course: true
      }
    })
  } catch (error) {
    console.error("Error fetching exam with questions:", error)
    return null
  }
}
