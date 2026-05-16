"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addTeacherNote(studentId: string, content: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const teacher = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!teacher || teacher.role !== "TEACHER") throw new Error("Not authorized as a teacher")

    const note = await prisma.teacherNote.create({
      data: {
        studentId,
        teacherId: teacher.id,
        content,
      }
    })

    revalidatePath("/teacher/submissions")
    return note
  } catch (error) {
    console.error("Error adding teacher note:", error)
    throw error
  }
}

export async function getTeacherNotes(studentId: string) {
  try {
    const { userId } = await auth()
    if (!userId) return []

    const teacher = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!teacher || teacher.role !== "TEACHER") return []

    return await prisma.teacherNote.findMany({
      where: { studentId, teacherId: teacher.id },
      orderBy: { createdAt: "desc" }
    })
  } catch (error) {
    console.error("Error fetching teacher notes:", error)
    return []
  }
}
