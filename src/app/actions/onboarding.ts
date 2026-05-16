"use server"

import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import { logger } from "@/lib/logger"

export async function completeOnboarding(role: Role) {
  const isDemoMode = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("YOUR_KEY_HERE")

  if (isDemoMode) {
    if (role === "TEACHER") redirect("/teacher/dashboard")
    else redirect("/student/dashboard")
    return
  }

  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !user) {
    throw new Error("Unauthorized")
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId }
  })

  if (existingUser) {
    // Update role if they are somehow re-doing onboarding
    await prisma.user.update({
      where: { clerkId: userId },
      data: { role }
    })
  } else {
    // Create new user with selected role
    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        email: user.emailAddresses[0].emailAddress,
        role: role,
      }
    })

    // If student, auto-enroll in intro course if it exists
    if (role === "STUDENT") {
      try {
        const introCourse = await prisma.course.findUnique({
          where: { id: "course_intro" }
        })
        if (introCourse) {
          await prisma.enrollment.create({
            data: {
              studentId: newUser.id,
              courseId: introCourse.id,
            }
          })
        }
      } catch (e) {
        logger.error("Auto-enrollment failed during onboarding", e)
      }
    }
  }

  // Redirect to the appropriate dashboard
  if (role === "TEACHER") {
    redirect("/teacher/dashboard")
  } else {
    redirect("/student/dashboard")
  }
}

export async function checkOnboardingStatus() {
  const isDemoMode = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("YOUR_KEY_HERE")
  
  if (isDemoMode) return { isOnboarded: true, role: "STUDENT" as const }

  const { userId } = await auth()
  
  if (!userId) return { isOnboarded: false }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })

  return { isOnboarded: !!user, role: user?.role }
}
