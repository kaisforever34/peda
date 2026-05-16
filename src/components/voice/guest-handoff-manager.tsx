"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { saveVoiceSession } from "@/app/actions/voice"
import { toast } from "sonner"

export function GuestHandoffManager() {
  const { isSignedIn, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    const pendingSession = localStorage.getItem("peda_pending_voice_session")
    if (pendingSession) {
      try {
        const data = JSON.parse(pendingSession)
        
        // Prevent re-processing the same session if multiple tabs are open
        localStorage.removeItem("peda_pending_voice_session")

        const syncSession = async () => {
          const result = await saveVoiceSession(data)
          if (result.success) {
            toast.success("Welcome back! Your previous voice session has been synced to your profile. +50 XP awarded!", {
              duration: 5000,
              icon: "✨"
            })
          }
        }

        syncSession()
      } catch (e) {
        console.error("Failed to sync guest session", e)
      }
    }
  }, [isSignedIn, isLoaded])

  return null
}
