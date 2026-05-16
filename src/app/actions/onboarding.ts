"use server"

import { Role } from "@prisma/client"
import { redirect } from "next/navigation"

export async function completeOnboarding(role: Role) {
  if (role === "TEACHER") redirect("/teacher/dashboard")
  else redirect("/student/dashboard")
}

export async function checkOnboardingStatus() {
  return { isOnboarded: true, role: "STUDENT" as const }
}
