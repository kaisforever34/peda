"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { StudentDashboardData, TeacherDashboardData } from "@/types"
import { redirect } from "next/navigation"
import { getStudentPerformanceProjection, getClassroomPerformanceTrends } from "@/lib/analytics"

export async function getStudentDashboardData(): Promise<StudentDashboardData> {
  try {
  const { userId } = await auth();

  const user = userId ? await prisma.user.findUnique({ 
    where: { clerkId: userId },
    include: {
      badges: {
        include: { badge: true }
      }
    }
  }) : null;

  // Fallback for Demo User
  const currentUser = user || {
    id: "demo_student",
    name: "Demo Student",
    points: 1250,
    streak: 5,
    badges: []
  }

  const [enrollments, assignments, exams, announcements, performanceProjection] = await Promise.all([
    prisma.enrollment.findMany({
      where: { studentId: currentUser.id },
      include: { 
        course: true,
        student: true 
      },
      orderBy: { enrolledAt: "desc" }
    }),
    prisma.assignment.findMany({
      where: {
        course: {
          enrollments: {
            some: { studentId: currentUser.id }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.exam.findMany({
      where: {
        course: {
          enrollments: {
            some: { studentId: currentUser.id }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { teacher: true }
    }),
    getStudentPerformanceProjection(currentUser.id)
  ])

  // Calculate points: 100 points for each completed assignment or exam (mock logic using length for now)
  const points = (assignments.length * 50) + (exams.length * 100);

  // Mock global class leaderboard including the current user
  const leaderboard = [
    { id: "mock1", name: "Sarah J.", points: points + 150 },
    { id: "mock2", name: "Michael R.", points: points + 50 },
    { id: currentUser.id, name: currentUser.name + " (You)", points: points },
    { id: "mock4", name: "David K.", points: Math.max(0, points - 50) },
    { id: "mock5", name: "Emma W.", points: Math.max(0, points - 100) },
  ].sort((a, b) => b.points - a.points);

  return {
    userName: currentUser.name,
    enrollments,
    assignments,
    exams,
    points: currentUser.points, 
    streak: currentUser.streak,
    badges: (currentUser as any).badges?.map((ub: any) => ({ ...ub.badge, awardedAt: ub.awardedAt })) || [],
    announcements,
    leaderboard,
    performanceProjection
  }
  } catch (error) {
    console.error("Error fetching student dashboard data:", error)
    return {
      userName: "Student",
      enrollments: [],
      assignments: [],
      exams: [],
      points: 0,
      streak: 0,
      badges: [],
      announcements: [],
      leaderboard: [],
    }
  }
}

export async function getTeacherDashboardData(): Promise<TeacherDashboardData> {
  try {
  const { userId } = await auth();

  let user = userId ? await prisma.user.findUnique({ where: { clerkId: userId } }) : null;

  // Fallback for Demo Teacher
  if (!user) {
     const seededTeacher = await prisma.user.findFirst({ where: { role: "TEACHER" } })
     user = seededTeacher || {
       id: "demo_teacher",
       name: "Demo Teacher",
       role: "TEACHER"
     } as any
  }

  const classrooms = await prisma.classroom.findMany({
    where: { teacherId: user!.id },
    include: {
      _count: {
        select: { students: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  const [courses, assignments, exams, announcements, performanceData] = await Promise.all([
    prisma.course.findMany({
      where: { teacherId: user!.id },
      orderBy: { createdAt: "desc" }
    }),
    prisma.assignment.findMany({
      where: {
        course: {
          teacherId: user!.id
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.exam.findMany({
      where: {
        course: {
          teacherId: user!.id
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.announcement.findMany({
      where: { teacherId: user!.id },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    classrooms.length > 0 
      ? getClassroomPerformanceTrends(classrooms[0].id)
      : Promise.resolve([])
  ])

  // If no real performance data, use mock for demo
  const finalPerformanceData = performanceData.length > 0 ? performanceData : Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'short' }),
      averageScore: 65 + Math.floor(Math.random() * 25)
    };
  });

  return {
    courses,
    classrooms,
    assignments,
    exams,
    performanceData: finalPerformanceData,
    announcements
  }
  } catch (error) {
    console.error("Error fetching teacher dashboard data:", error)
    return {
      courses: [],
      classrooms: [],
      assignments: [],
      exams: [],
      performanceData: [],
      announcements: []
    }
  }
}
