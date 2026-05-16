"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { withRole } from "@/lib/safe-action"

export async function getCourseWithSyllabus(courseId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' }
          }
        }
      }
    }
  })

  return course
}

export const saveSyllabus = withRole(["TEACHER"], async (user, { courseId, modules }: {
  courseId: string,
  modules: {
    id: string
    title: string
    order: number
    lessons: {
      id: string
      title: string
      contentType: "VIDEO" | "TEXT" | "QUIZ"
      order: number
    }[]
  }[]
}) => {
  const course = await prisma.course.findUnique({ 
    where: { id: courseId },
    include: { 
      modules: { include: { lessons: true } }
    }
  })
  
  if (!course || course.teacherId !== user.id) {
    throw new Error("Forbidden: You do not own this course")
  }

  // --- SYLLABUS DIFFING LOGIC ---
  const existingLessons = new Map(course.modules.flatMap(m => m.lessons).map(l => [l.id, l]));
  const incomingModuleIds = new Set(modules.map(m => m.id));
  const incomingLessonIds = new Set(modules.flatMap(m => m.lessons).map(l => l.id));

  const moduleIdsToDelete = course.modules.map(m => m.id).filter(id => !incomingModuleIds.has(id));
  const lessonIdsToDelete = Array.from(existingLessons.keys()).filter(id => !incomingLessonIds.has(id));

  await prisma.$transaction(async (tx) => {
    if (lessonIdsToDelete.length > 0) {
      await tx.lesson.deleteMany({ where: { id: { in: lessonIdsToDelete } } });
    }
    if (moduleIdsToDelete.length > 0) {
      await tx.module.deleteMany({ where: { id: { in: moduleIdsToDelete } } });
    }

    for (const mod of modules) {
      await tx.module.upsert({
        where: { id: mod.id },
        create: { id: mod.id, title: mod.title, order: mod.order, courseId },
        update: { title: mod.title, order: mod.order }
      });

      for (const lesson of mod.lessons) {
        await tx.lesson.upsert({
          where: { id: lesson.id },
          create: {
            id: lesson.id,
            title: lesson.title,
            contentType: lesson.contentType,
            order: lesson.order,
            moduleId: mod.id,
            courseId,
            content: "",
            status: "DRAFT",
          },
          update: {
            title: lesson.title,
            contentType: lesson.contentType,
            order: lesson.order,
            moduleId: mod.id,
          }
        });
      }
    }
  });

  revalidatePath(`/teacher/courses/${courseId}`)
  return { success: true }
})
