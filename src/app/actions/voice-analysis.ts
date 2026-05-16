"use server"

import { uploadFile } from "@/lib/storage"
import { VoiceResults } from "@/types"
import { logger } from "@/lib/logger"
import { checkLanguageMismatch } from "@/lib/language-detection"
import { computeVoiceScores } from "@/lib/voice-scoring"

export async function analyzeVoiceAction(formData: FormData): Promise<{
  success: boolean
  data?: {
    results: VoiceResults
    audioUrl: string
    transcript: string
  }
  error?: string
}> {
  try {
    const audioFile = formData.get("audio") as File
    const language = (formData.get("language") as string) || "English"
    const clientTranscript = formData.get("transcript") as string

    if (!audioFile) return { success: false, error: "No audio provided" }

    const uploadResult = await uploadFile(audioFile, "recordings")
    if (!uploadResult.success) return { success: false, error: uploadResult.error }

    const transcript = clientTranscript || "Transcript unavailable"
    const validation = checkLanguageMismatch(transcript, language)

    const words = transcript.split(/\s+/).filter(w => w.length > 0)
    const wordCount = words.length
    const estimatedDurationMs = 30000
    const estimatedWpm = wordCount > 0 ? Math.round((wordCount / 30) * 60) : 0
    const fillerRegex = /\b(um|uh|euh|يعني)\b/gi
    const fillersCount = (transcript.match(fillerRegex) || []).length

    // Determine detected language label for advice
    let detectedLanguage: string | undefined
    if (validation.mismatch && validation.message) {
      const match = validation.message.match(/in\s+(\w+)/)
      if (match) detectedLanguage = match[1]
    }

    const results = computeVoiceScores({
      transcript,
      selectedLanguage: language,
      detectedLanguage,
      languageMismatch: validation.mismatch,
      fillers: fillersCount,
      wpm: estimatedWpm,
      durationMs: estimatedDurationMs,
    })

    return {
      success: true,
      data: {
        results,
        audioUrl: uploadResult.url!,
        transcript,
      }
    }
  } catch (error) {
    logger.error("Voice analysis error", error)
    return { success: false, error: "Failed to analyze voice on server" }
  }
}
