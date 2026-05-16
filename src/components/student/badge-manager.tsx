"use client"

import { useEffect, useRef } from "react"
import { checkAndAwardBadges } from "@/app/actions/gamification"
import { toast } from "sonner"
import { Award } from "lucide-react"

export function BadgeManager() {
  const hasChecked = useRef(false)

  useEffect(() => {
    if (hasChecked.current) return
    hasChecked.current = true

    const checkBadges = async () => {
      try {
        const newBadges = await checkAndAwardBadges()
        if (newBadges && newBadges.length > 0) {
          newBadges.forEach(badge => {
            toast.success(`New Achievement Unlocked!`, {
              description: `You've earned the "${badge.name}" badge: ${badge.description}`,
              icon: <Award className="h-5 w-5 text-yellow-500" />,
              duration: 6000
            })
          })
        }
      } catch (e) {
        console.error("Failed to check badges", e)
      }
    }

    checkBadges()
  }, [])

  return null
}
