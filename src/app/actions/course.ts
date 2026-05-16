"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { EducationLevel } from "@prisma/client"

import { courseSchema } from "@/lib/validations"

export async function createCourse(formData: FormData) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) throw new Error("User not found")

    const rawData = Object.fromEntries(formData.entries())
    const validatedData = courseSchema.parse(rawData)

    const course = await prisma.course.create({
      data: {
        ...validatedData,
        teacherId: user.id,
        status: "DRAFT"
      }
    })

    revalidatePath("/teacher/courses")
    return { success: true, data: course }
  } catch (error: any) {
    console.error("Error creating course:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create course" 
    }
  }
}

export async function getCourses(page: number = 1, limit: number = 10) {
  try {
    const { userId } = await auth()
    if (!userId) return { courses: [], total: 0, pages: 0 }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return { courses: [], total: 0, pages: 0 }

    const skip = (page - 1) * limit

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where: {
          teacherId: user.id
        },
        include: {
          _count: {
            select: {
              lessons: true,
              enrollments: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip,
        take: limit
      }),
      prisma.course.count({
        where: {
          teacherId: user.id
        }
      })
    ])

    return { 
      courses, 
      total, 
      pages: Math.ceil(total / limit),
      currentPage: page
    }
  } catch (error) {
    console.error("Error fetching courses:", error)
    return { courses: [], total: 0, pages: 0 }
  }
}

export async function publishCourse(courseId: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user || user.role !== "TEACHER") throw new Error("Forbidden")

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { teacherId: true }
    })
    if (!course) throw new Error("Course not found")
    if (course.teacherId !== user.id) throw new Error("You do not have permission to publish this course")

    await prisma.course.update({
      where: { id: courseId },
      data: { status: "PUBLISHED" }
    })

    revalidatePath("/teacher/courses")
    return { success: true }
  } catch (error: any) {
    console.error("Error publishing course:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteCourse(courseId: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    // Check ownership
    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) throw new Error("User not found")

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { teacherId: true }
    })

    if (!course || course.teacherId !== user.id) {
      throw new Error("You do not have permission to delete this course")
    }

    await prisma.course.delete({
      where: { id: courseId }
    })

    revalidatePath("/teacher/courses")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting course:", error)
    return { success: false, error: error.message }
  }
}
