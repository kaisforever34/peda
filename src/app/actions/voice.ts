"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { withRole } from "@/lib/safe-action"

export const saveVoiceSession = withRole(["STUDENT", "TEACHER", "ADMIN"], async (user, data: {
  transcript: string
  score: number
  wordFeedback: any[]
  language: string
  audioUrl?: string
}) => {
  const session = await prisma.voiceSession.create({
    data: {
      studentId: user.id,
      prompt: "Guest Demo Session",
      transcript: data.transcript,
      scores: {
        fluency: data.score
      },
      feedback: {
        wordFeedback: data.wordFeedback
      },
      audioUrl: data.audioUrl,
      clarity: data.score, // Simple mapping for demo
      confidence: data.score
    }
  })

  // Award some points for completing a session
  await prisma.user.update({
    where: { id: user.id },
    data: {
      points: { increment: 50 },
      lastActivity: new Date()
    }
  })

  revalidatePath("/student/dashboard")
  revalidatePath("/student/voice-coach")
  
  return { success: true, id: session.id }
})
