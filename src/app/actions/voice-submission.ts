"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import { updateStreak } from "./gamification"

import { VoiceResults } from "@/types"

export async function submitVoiceExam(examId: string, results: VoiceResults, transcript: string, audioUrl?: string, selfScore?: number) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) throw new Error("User not found")

    // Verify exam exists and student is enrolled
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { course: true }
    })
    if (!exam) throw new Error("Exam not found")

    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: user.id, courseId: exam.courseId } }
    })
    if (!enrollment) throw new Error("Not enrolled in this course")

    // Create a submission record
    const submission = await prisma.submission.create({
      data: {
        studentId: user.id,
        examId,
        status: "GRADED",
        aiScore: (results.scores.clarity + results.scores.pace + results.scores.accuracy) / 3,
        aiFeedback: results.aiAdvise,
        selfScore,
        answers: { transcript, scores: results.scores, audioUrl } 
      }
    })

    // Also save specific voice data session
    await prisma.voiceSession.create({
      data: {
        studentId: user.id,
        prompt: "Teacher assigned test",
        transcript: transcript,
        audioUrl: audioUrl,
        clarity: results.scores.clarity,
        pace: results.scores.pace,
        confidence: results.scores.accuracy,
      }
    })

    await updateStreak()

    revalidatePath("/student/results")
    revalidatePath("/teacher/submissions")
    return { success: true, data: submission }
  } catch (error: any) {
    console.error("Error submitting voice exam:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to submit voice exam" 
    }
  }
}
