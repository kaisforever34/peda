"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import { ExamType } from "@prisma/client"

import { examSchema } from "@/lib/validations"

export async function createExam(formData: FormData) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) throw new Error("User not found")

    const rawData = Object.fromEntries(formData.entries())
    const validatedData = examSchema.parse(rawData)

    const exam = await prisma.exam.create({
      data: {
        ...validatedData,
        status: "DRAFT"
      }
    })

    revalidatePath("/teacher/exams")
    return { success: true, data: exam }
  } catch (error: any) {
    console.error("Error creating exam:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create exam" 
    }
  }
}

export async function getExams(page: number = 1, limit: number = 10) {
  try {
    const { userId } = await auth()
    if (!userId) return { exams: [], total: 0, pages: 0 }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return { exams: [], total: 0, pages: 0 }

    const skip = (page - 1) * limit

    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        where: {
          course: {
            teacherId: user.id
          }
        },
        include: {
          course: true,
          _count: {
            select: {
              questions: true,
              submissions: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip,
        take: limit
      }),
      prisma.exam.count({
        where: {
          course: {
            teacherId: user.id
          }
        }
      })
    ])

    return { 
      exams, 
      total, 
      pages: Math.ceil(total / limit),
      currentPage: page
    }
  } catch (error) {
    console.error("Error fetching exams:", error)
    return { exams: [], total: 0, pages: 0 }
  }
}

export async function deleteExam(id: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user || user.role !== "TEACHER") throw new Error("Forbidden")

    const exam = await prisma.exam.findUnique({
      where: { id },
      select: { course: { select: { teacherId: true } } }
    })
    if (!exam) throw new Error("Exam not found")
    if (exam.course.teacherId !== user.id) throw new Error("You do not have permission to delete this exam")

    await prisma.exam.delete({
      where: { id }
    })

    revalidatePath("/teacher/exams")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
