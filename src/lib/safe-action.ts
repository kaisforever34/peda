import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import { logger } from "@/lib/logger"

export type ActionState<T> = {
  success: boolean
  data?: T
  error?: string
}

/**
 * Higher-order function to wrap server actions with role-based authorization.
 * Usage: export const myAction = withRole(["TEACHER"], async (user, data) => { ... })
 */
export function withRole<TInput, TOutput>(
  allowedRoles: Role[],
  action: (user: { id: string; clerkId: string; role: Role }, input: TInput) => Promise<TOutput>
) {
  return async (input: TInput): Promise<ActionState<TOutput>> => {
    try {
      const { userId } = await auth()
      if (!userId) {
        return { success: false, error: "Unauthorized: Please sign in." }
      }

      const user = await prisma.user.findUnique({ where: { clerkId: userId } })
      if (!user) {
        return { success: false, error: "User profile not found. Please complete onboarding." }
      }

      if (!allowedRoles.includes(user.role)) {
        return { success: false, error: `Forbidden: This action requires ${allowedRoles.join(" or ")} access.` }
      }

      const result = await action({ id: user.id, clerkId: user.clerkId, role: user.role }, input)
      return { success: true, data: result }
    } catch (error) {
      logger.error("Action Error", error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred." 
      }
    }
  }
}
