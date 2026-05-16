"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function getStudentCertificatesData() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { certificates: [], inProgress: [], badges: [] }
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return { certificates: [], inProgress: [], badges: [] }
    }

    const [certificates, enrollments, exams] = await Promise.all([
      prisma.certificate.findMany({
        where: { studentId: user.id },
        include: { course: true },
        orderBy: { issuedAt: "desc" }
      }),
      prisma.enrollment.findMany({
        where: { studentId: user.id },
        include: { course: true },
        orderBy: { enrolledAt: "desc" }
      }),
      prisma.submission.findMany({
        where: { studentId: user.id, examId: { not: null } }
      })
    ])

    const inProgress = enrollments
      .filter((e: any) => e.progress < 100)
      .map((e: any) => ({
        id: e.id,
        title: e.course.title,
        progress: e.progress,
        requiredProgress: 100,
        courseId: e.courseId
      }))

    const badges = [
      { id: "1", name: "First Course", description: "Enrolled in your first course", earned: enrollments.length > 0 },
      { id: "2", name: "Quick Learner", description: "Complete a course rapidly", earned: certificates.length > 0 },
      { id: "3", name: "Active Student", description: "Submitted at least one exam", earned: exams.length > 0 },
      { id: "4", name: "Perfect Score", description: "Score 100% on any exam", earned: exams.some((e: any) => e.aiScore === 100 || e.teacherScore === 100) },
      { id: "5", name: "Course Master", description: "Complete 5 courses", earned: certificates.length >= 5 },
    ]

    return {
      certificates,
      inProgress,
      badges
    }
  } catch (error) {
    console.error("Error fetching certificates data:", error)
    return { certificates: [], inProgress: [], badges: [] }
  }
}
