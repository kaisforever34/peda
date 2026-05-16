"use server"

import { prisma } from "@/lib/prisma"
import { withRole } from "@/lib/safe-action"
import { revalidatePath } from "next/cache"
import crypto from "crypto"

/**
 * Allows a student to join a classroom using a 6-8 character join code.
 */
export const joinClassroomByCode = withRole(["STUDENT"], async (user, { joinCode }: { joinCode: string }) => {
  // 1. Find the classroom by code
  const classroom = await prisma.classroom.findUnique({
    where: { joinCode: joinCode.toUpperCase() },
    include: {
      courses: true
    }
  })

  if (!classroom) {
    throw new Error("Invalid join code. Please check with your teacher.")
  }

  // 2. Check if already a member
  const existingMembership = await prisma.classroomStudent.findUnique({
    where: {
      classroomId_studentId: {
        classroomId: classroom.id,
        studentId: user.id
      }
    }
  })

  if (existingMembership) {
    throw new Error("You are already a member of this classroom.")
  }

  // 3. Create membership and auto-enroll in classroom courses
  await prisma.$transaction(async (tx) => {
    // Add to classroom
    await tx.classroomStudent.create({
      data: {
        classroomId: classroom.id,
        studentId: user.id
      }
    })

    // Auto-enroll in all courses associated with this classroom
    for (const course of classroom.courses) {
      await tx.enrollment.upsert({
        where: {
          studentId_courseId: {
            studentId: user.id,
            courseId: course.id
          }
        },
        create: {
          studentId: user.id,
          courseId: course.id,
        },
        update: {} // Do nothing if already enrolled
      })
    }
  })

  revalidatePath("/student/dashboard")
  return { 
    success: true, 
    classroomTitle: classroom.title,
    courseCount: classroom.courses.length 
  }
})

/**
 * Utility for teachers to regenerate a join code if compromised.
 */
export const regenerateJoinCode = withRole(["TEACHER"], async (user, { classroomId }: { classroomId: string }) => {
  const classroom = await prisma.classroom.findUnique({
    where: { id: classroomId }
  })

  if (!classroom || classroom.teacherId !== user.id) {
    throw new Error("Unauthorized: You do not own this classroom.")
  }

  const newCode = crypto.randomBytes(3).toString("hex").toUpperCase()

  await prisma.classroom.update({
    where: { id: classroomId },
    data: { joinCode: newCode }
  })

  revalidatePath(`/teacher/classrooms/${classroomId}`)
  return { newCode }
})
