"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { withRole } from "@/lib/safe-action"
import { logger } from "@/lib/logger"
import { classroomSchema } from "@/lib/validations"
import { auth } from "@/lib/auth"
import crypto from "crypto"

export const createClassroom = withRole(["TEACHER"], async (user, formData: FormData) => {
  const rawData = Object.fromEntries(formData.entries())
  const validatedData = classroomSchema.parse(rawData)
  const joinCode = crypto.randomBytes(3).toString("hex").toUpperCase()

  const classroom = await prisma.classroom.create({
    data: {
      ...validatedData,
      teacherId: user.id,
      joinCode: joinCode,
      status: "ACTIVE"
    }
  })

  revalidatePath("/teacher/classes")
  return classroom
})

export async function getClassrooms() {
  const { userId } = await auth()
  if (!userId) return []

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return []

  return await prisma.classroom.findMany({
    where: {
      teacherId: user.id
    },
    include: {
      _count: {
        select: { students: true }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}

export async function getClassroom(id: string) {
  const { userId } = await auth()
  if (!userId) return null

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return null

  return await prisma.classroom.findUnique({
    where: { id, teacherId: user.id },
    include: {
      students: {
        include: {
          student: true
        }
      },
      courses: true,
      _count: {
        select: { students: true }
      }
    }
  })
}

export const updateClassroom = withRole(["TEACHER"], async (user, { id, ...data }: { id: string } & any) => {
  const classroom = await prisma.classroom.update({
    where: { id, teacherId: user.id },
    data
  })
  revalidatePath("/teacher/classes")
  return classroom
})

export const archiveClassroom = withRole(["TEACHER"], async (user, id: string) => {
  const classroom = await prisma.classroom.update({
    where: { id, teacherId: user.id },
    data: { status: "ARCHIVED" }
  })
  revalidatePath("/teacher/classes")
  return classroom
})

export const deleteClassroom = withRole(["TEACHER"], async (user, id: string) => {
  await prisma.classroom.delete({
    where: { id, teacherId: user.id }
  })
  revalidatePath("/teacher/classes")
  return { success: true }
})
