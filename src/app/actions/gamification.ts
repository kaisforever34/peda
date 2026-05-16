"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

/**
 * Updates the user's streak based on their last activity.
 * Call this whenever the user completes a significant action (e.g., lesson, voice session).
 */
export async function updateStreak() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return { success: false, error: "Unauthorized" }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, streak: true, lastActivity: true }
  })

  if (!user) return { success: false, error: "User not found" }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  let newStreak = user.streak
  let lastActivityDate = user.lastActivity ? new Date(user.lastActivity.getFullYear(), user.lastActivity.getMonth(), user.lastActivity.getDate()) : null

  if (!lastActivityDate) {
    newStreak = 1
  } else {
    const diffTime = Math.abs(today.getTime() - lastActivityDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      // Activity on the very next day
      newStreak += 1
    } else if (diffDays > 1) {
      // Streak broken
      newStreak = 1
    }
    // If diffDays === 0, streak stays the same (already active today)
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      streak: newStreak,
      lastActivity: now,
      points: { increment: 10 } // Reward 10 points for activity
    }
  })

  revalidatePath("/student/dashboard")
  return { success: true, streak: newStreak }
}

/**
 * Checks and awards badges based on user performance.
 */
export async function checkAndAwardBadges() {
  const { userId: clerkId } = await auth()
  if (!clerkId) return []

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      submissions: true,
      badges: { include: { badge: true } }
    }
  })

  if (!user) return []

  // Ensure seed badges exist (In a real app, this would be a seed script)
  await ensureSeedBadges()

  const allBadges = await prisma.badge.findMany()
  const userBadgeIds = new Set(user.badges.map(ub => ub.badgeId))
  const newBadgesAwarded = []

  for (const badge of allBadges) {
    if (userBadgeIds.has(badge.id)) continue

    // Example logic for "VOICE_SESSIONS:5"
    if (badge.criteria.startsWith("SUBMISSIONS:")) {
      const target = parseInt(badge.criteria.split(":")[1])
      if (user.submissions.length >= target) {
        await prisma.userBadge.create({
          data: { userId: user.id, badgeId: badge.id }
        })
        newBadgesAwarded.push(badge)
      }
    }
    
    if (badge.criteria.startsWith("STREAK:")) {
        const target = parseInt(badge.criteria.split(":")[1])
        if (user.streak >= target) {
          await prisma.userBadge.create({
            data: { userId: user.id, badgeId: badge.id }
          })
          newBadgesAwarded.push(badge)
        }
      }
  }

  if (newBadgesAwarded.length > 0) {
    revalidatePath("/student/dashboard")
  }

  return newBadgesAwarded
}

async function ensureSeedBadges() {
  const seedBadges = [
    { name: "The First Step", description: "Complete your first submission", icon: "Flag", color: "text-blue-500", criteria: "SUBMISSIONS:1" },
    { name: "Consistent Learner", description: "Maintain a 3-day streak", icon: "Zap", color: "text-orange-500", criteria: "STREAK:3" },
    { name: "Master Orator", description: "Complete 10 voice sessions", icon: "Mic", color: "text-purple-500", criteria: "SUBMISSIONS:10" },
  ]

  for (const b of seedBadges) {
    await prisma.badge.upsert({
      where: { name: b.name },
      update: {},
      create: b
    })
  }
}
