"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { updateStreak } from "./gamification"

export async function toggleLessonCompletion(lessonId: string, courseId: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) throw new Error("User not found")

    const existing = await prisma.lessonCompletion.findUnique({
      where: { studentId_lessonId: { studentId: user.id, lessonId } }
    })

    if (existing) {
      await prisma.lessonCompletion.delete({ where: { id: existing.id } })
    } else {
      await prisma.lessonCompletion.create({
        data: { studentId: user.id, lessonId }
      })
      await updateStreak()
    }

    revalidatePath(`/student/courses/${courseId}/lessons/${lessonId}`)
    revalidatePath(`/student/courses/${courseId}`)
  } catch (error) {
    console.error("Error toggling lesson completion:", error)
    throw error
  }
}

export async function getStudentLesson(lessonId: string) {
  try {
    const { userId } = await auth()
    if (!userId) return null

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return null

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        completions: {
          where: { studentId: user.id }
        },
        module: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
              select: { id: true, title: true, order: true, contentType: true }
            }
          }
        },
        course: {
          select: { id: true, title: true }
        }
      }
    })

    if (!lesson) return null

    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: user.id, courseId: lesson.courseId } }
    })

    if (!enrollment) return null

    return { lesson, user }
  } catch (error) {
    console.error("Error fetching lesson:", error)
    return null
  }
}
