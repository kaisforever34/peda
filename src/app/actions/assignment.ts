"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"

import { assignmentSchema } from "@/lib/validations"

export async function createAssignment(formData: FormData) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) throw new Error("User not found")

    const rawData = Object.fromEntries(formData.entries())
    const validatedData = assignmentSchema.parse(rawData)

    const assignment = await prisma.assignment.create({
      data: {
        ...validatedData
      }
    })

    revalidatePath("/teacher/assignments")
    return { success: true, data: assignment }
  } catch (error: any) {
    console.error("Error creating assignment:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create assignment" 
    }
  }
}

export async function getAssignments() {
  try {
    const { userId } = await auth()
    if (!userId) return []

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return []

    return await prisma.assignment.findMany({
      where: {
        course: {
          teacherId: user.id
        }
      },
      include: {
        course: true,
        _count: {
          select: { submissions: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  } catch (error) {
    console.error("Error fetching assignments:", error)
    return []
  }
}

export async function updateAssignment(id: string, data: any) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user || user.role !== "TEACHER") throw new Error("Forbidden")

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      select: { course: { select: { teacherId: true } } }
    })
    if (!assignment) throw new Error("Assignment not found")
    if (assignment.course.teacherId !== user.id) throw new Error("You do not have permission to modify this assignment")

    const updated = await prisma.assignment.update({
      where: { id },
      data
    })

    revalidatePath("/teacher/assignments")
    return { success: true, data: updated }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteAssignment(id: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user || user.role !== "TEACHER") throw new Error("Forbidden")

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      select: { course: { select: { teacherId: true } } }
    })
    if (!assignment) throw new Error("Assignment not found")
    if (assignment.course.teacherId !== user.id) throw new Error("You do not have permission to delete this assignment")

    await prisma.assignment.delete({
      where: { id }
    })

    revalidatePath("/teacher/assignments")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
