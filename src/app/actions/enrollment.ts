"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"

export async function joinClassroom(classroomId: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) throw new Error("User not found. Please complete registration first.")

    const enrollment = await prisma.classroomStudent.create({
      data: {
        classroomId: classroomId,
        studentId: user.id
      }
    })

    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
      include: { courses: true }
    })

    if (classroom?.courses) {
      await prisma.$transaction(
        classroom.courses.map(course =>
          prisma.enrollment.upsert({
            where: {
              studentId_courseId: {
                studentId: user.id,
                courseId: course.id
              }
            },
            create: {
              studentId: user.id,
              courseId: course.id
            },
            update: {}
          })
        )
      )
    }

    revalidatePath("/student/dashboard")
    revalidatePath("/student/courses")
    return enrollment
  } catch (error: any) {
    console.error("Error joining classroom:", error)
    throw error
  }
}

export async function getStudentCourses() {
  try {
    const { userId } = await auth()
    if (!userId) return []

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return []

    return await prisma.enrollment.findMany({
      where: { studentId: user.id },
      include: {
        course: {
          include: {
            _count: {
              select: { lessons: true }
            }
          }
        }
      },
      orderBy: { enrolledAt: "desc" }
    })
  } catch (error) {
    console.error("Error fetching student courses:", error)
    return []
  }
}

export async function getAvailableClassrooms() {
  try {
    return await prisma.classroom.findMany({
      include: {
        teacher: true,
        _count: { select: { students: true } }
      },
      orderBy: { createdAt: "desc" }
    })
  } catch (error) {
    console.error("Error fetching classrooms:", error)
    return []
  }
}

export async function getCourseDetail(courseId: string) {
  try {
    const { userId } = await auth()
    if (!userId) return null

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return null

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: courseId
        }
      },
      include: {
        course: {
          include: {
            teacher: true,
            modules: {
              include: {
                lessons: {
                  include: {
                    completions: {
                      where: { studentId: user.id }
                    }
                  },
                  orderBy: { order: "asc" }
                }
              },
              orderBy: { order: "asc" }
            }
          }
        }
      }
    })

    return enrollment
  } catch (error) {
    console.error("Error fetching course detail:", error)
    return null
  }
}
