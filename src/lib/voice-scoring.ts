import { VoiceResults, WordFeedback } from "@/types"

export interface ScoringInput {
  transcript: string
  subject?: string
  selectedLanguage: string
  detectedLanguage?: string
  languageMismatch: boolean
  fillers: number
  wpm: number
  durationMs: number
}

export function computeVoiceScores(input: ScoringInput): VoiceResults {
  const {
    transcript,
    subject,
    selectedLanguage,
    detectedLanguage,
    languageMismatch,
    fillers,
    wpm,
  } = input

  const fullText = transcript.trim()
  const spokenWords = fullText ? fullText.split(/\s+/).filter(w => w.length > 0) : []
  const isEmpty = spokenWords.length === 0

  const isGibberish = fullText.length > 50 && (
    spokenWords.reduce((acc, w) => acc + w.length, 0) / Math.max(1, spokenWords.length) > 20 ||
    spokenWords.reduce((acc, w) => acc + w.length, 0) / Math.max(1, spokenWords.length) < 2
  )

  const finalLanguageError = languageMismatch || isGibberish || isEmpty

  // Clarity: filler-based with spillover penalty
  const clarity = finalLanguageError
    ? (languageMismatch ? 5 : 10)
    : Math.max(15, Math.min(100, 100 - fillers * 8))

  // Pace: WPM-based with clearer tiers
  const pace = finalLanguageError
    ? (languageMismatch ? 5 : 10)
    : wpm > 180 ? 55
    : wpm > 160 ? 75
    : wpm < 60 ? 45
    : wpm < 80 ? 75
    : 92

  // Accuracy: token intersection against subject
  let accuracyRaw = 100
  if (subject && !finalLanguageError) {
    const targetWords = new Set(subject.split(/\s+/).filter(w => w.length > 2))
    if (targetWords.size > 0) {
      const spokenSet = new Set(spokenWords)
      let matches = 0
      targetWords.forEach(tw => { if (spokenSet.has(tw)) matches++ })
      accuracyRaw = Math.round((matches / targetWords.size) * 100)
    }
  }
  const accuracy = finalLanguageError ? (languageMismatch ? 0 : 5) : accuracyRaw

  // Phonetics: independent metric based on vocabulary complexity + sentence structure
  const hasPhoneticError = languageMismatch || isGibberish
  const phonetics = computePhonetics(spokenWords, fullText, fillers, clarity, hasPhoneticError)

  // Word-level feedback
  const wordFeedback = computeWordFeedback(spokenWords, languageMismatch)

  // Emotion detection (rule-based, not random)
  const emotion = detectEmotion({ languageMismatch, isGibberish, isEmpty, wpm, fillers, accuracy })

  // Data-driven advice
  const aiAdvise = generateAdvice({
    languageMismatch,
    isGibberish,
    isEmpty,
    detectedLanguage,
    selectedLanguage,
    accuracy,
    clarity,
    pace,
    phonetics,
    wpm,
    fillers,
  })

  const nextPrompt = languageMismatch
    ? "Please try again using the correct language."
    : isGibberish
    ? "Please speak clearly into the microphone."
    : isEmpty
    ? "Press start and speak to begin."
    : "Good work. Try the next topic to build further."

  return {
    scores: { clarity, pace, accuracy, phonetics },
    wpm,
    fillers,
    isGibberish: isGibberish || languageMismatch,
    emotion,
    aiAdvise,
    nextPrompt,
    wordFeedback,
  }
}

function computePhonetics(
  words: string[],
  fullText: string,
  fillers: number,
  clarity: number,
  phoneticError: boolean
): number {
  if (phoneticError || words.length === 0) return 0

  // Vocabulary complexity: ratio of longer words
  const longWords = words.filter(w => w.length > 5).length
  const vocabComplexity = Math.min(100, (longWords / Math.max(1, words.length)) * 100)

  // Sentence completion: sentences ending with punctuation
  const sentences = fullText.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const completionRatio = sentences.length > 0
    ? (sentences.length) / Math.max(1, Math.ceil(words.length / 5))
    : 0
  const sentenceScore = Math.min(100, completionRatio * 100)

  // Filler penalty
  const fillerPenalty = fillers * 4

  return Math.round(Math.max(0, Math.min(100,
    vocabComplexity * 0.35 +
    sentenceScore * 0.25 +
    clarity * 0.25 -
    fillerPenalty
  )))
}

function computeWordFeedback(words: string[], mismatch: boolean): WordFeedback[] {
  return words.map(word => {
    if (mismatch) {
      return { word, score: Math.floor(Math.random() * 10) }
    }
    const isStopWord = /^\w{1,2}$/.test(word)
    const isLong = word.length > 8
    let base = 80
    if (isStopWord) base = 92
    if (isLong) base = 65
    const jitter = Math.floor(Math.random() * 15) - 7
    return { word, score: Math.max(0, Math.min(100, base + jitter)) }
  })
}

function detectEmotion(params: {
  languageMismatch: boolean
  isGibberish: boolean
  isEmpty: boolean
  wpm: number
  fillers: number
  accuracy: number
}): string {
  if (params.languageMismatch || params.isGibberish || params.isEmpty) return "Unclear"
  if (params.fillers > 5) return "Hesitant"
  if (params.wpm > 160 && params.accuracy > 70) return "Confident"
  if (params.wpm > 140) return "Enthusiastic"
  if (params.wpm < 70) return "Thoughtful"
  return "Neutral"
}

function generateAdvice(params: {
  languageMismatch: boolean
  isGibberish: boolean
  isEmpty: boolean
  detectedLanguage?: string
  selectedLanguage: string
  accuracy: number
  clarity: number
  pace: number
  phonetics: number
  wpm: number
  fillers: number
}): string {
  if (params.languageMismatch) {
    const detected = params.detectedLanguage || "a different language"
    return `Language mismatch: you selected ${params.selectedLanguage} but the system detected ${detected}. Switch languages or try speaking in ${params.selectedLanguage} for an accurate evaluation.`
  }

  if (params.isGibberish) {
    return "Speech pattern unclear. Speak naturally into the microphone at a normal pace for best results."
  }

  if (params.isEmpty) {
    return "No speech detected. Press start and speak to receive feedback."
  }

  const parts: string[] = []

  if (params.clarity >= 85 && params.fillers <= 2) {
    parts.push("Clear delivery with minimal filler words.")
  } else if (params.fillers > 4) {
    parts.push(`Try to reduce filler words (${params.fillers} detected). Pause instead of saying "um" or "uh".`)
  } else if (params.clarity < 60) {
    parts.push("Work on clarity. Speak each word distinctly.")
  } else {
    parts.push("Good clarity overall.")
  }

  if (params.wpm >= 70 && params.wpm <= 160) {
    parts.push(`Pacing is solid at ${params.wpm} WPM.`)
  } else if (params.wpm > 160) {
    parts.push(`Pace is fast (${params.wpm} WPM). Slow down slightly for better articulation.`)
  } else {
    parts.push(`Pace is slow (${params.wpm} WPM). Try to speak a bit faster for more natural flow.`)
  }

  if (params.phonetics >= 70) {
    parts.push("Good vocabulary range and sentence structure.")
  } else if (params.phonetics < 40) {
    parts.push("Try using more varied vocabulary and completing full sentences.")
  }

  if (params.accuracy < 30) {
    parts.push("Stay on topic by covering the subject keywords.")
  }

  return parts.join(" ")
}
