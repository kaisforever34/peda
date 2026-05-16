import { describe, it, expect } from 'vitest'
import { computeVoiceScores } from '../voice-scoring'

const baseInput = {
  transcript: 'the quick brown fox jumps over the lazy dog near the riverbank',
  selectedLanguage: 'English',
  languageMismatch: false,
  fillers: 1,
  wpm: 120,
  durationMs: 30000,
}

describe('computeVoiceScores', () => {
  it('returns high clarity with few fillers', () => {
    const r = computeVoiceScores(baseInput)
    expect(r.scores.clarity).toBeGreaterThanOrEqual(80)
  })

  it('penalizes clarity for many fillers', () => {
    const r = computeVoiceScores({ ...baseInput, fillers: 10 })
    expect(r.scores.clarity).toBe(20)
  })

  it('returns 92 pace for moderate WPM', () => {
    const r = computeVoiceScores({ ...baseInput, wpm: 120 })
    expect(r.scores.pace).toBe(92)
  })

  it('penalizes pace for fast WPM', () => {
    const r = computeVoiceScores({ ...baseInput, wpm: 190 })
    expect(r.scores.pace).toBe(55)
  })

  it('penalizes pace for slow WPM', () => {
    const r = computeVoiceScores({ ...baseInput, wpm: 50 })
    expect(r.scores.pace).toBe(45)
  })

  it('returns 100 accuracy when no subject provided', () => {
    const r = computeVoiceScores(baseInput)
    expect(r.scores.accuracy).toBe(100)
  })

  it('computes accuracy from subject token intersection', () => {
    const r = computeVoiceScores({
      ...baseInput,
      subject: 'quick brown fox riverbank',
    })
    expect(r.scores.accuracy).toBeGreaterThanOrEqual(75)
  })

  it('returns 0 accuracy for mismatch with subject', () => {
    const r = computeVoiceScores({
      ...baseInput,
      subject: 'quantum physics mechanics',
    })
    expect(r.scores.accuracy).toBe(0)
  })

  it('returns > 0 phonetics for normal speech', () => {
    const r = computeVoiceScores(baseInput)
    expect(r.scores.phonetics).toBeGreaterThan(0)
  })

  it('returns 0 phonetics on language mismatch', () => {
    const r = computeVoiceScores({ ...baseInput, languageMismatch: true })
    expect(r.scores.phonetics).toBe(0)
  })

  describe('language mismatch', () => {
    const mismatchInput = { ...baseInput, languageMismatch: true }

    it('sets clarity to 5', () => {
      const r = computeVoiceScores(mismatchInput)
      expect(r.scores.clarity).toBe(5)
    })

    it('sets pace to 5', () => {
      const r = computeVoiceScores(mismatchInput)
      expect(r.scores.pace).toBe(5)
    })

    it('sets accuracy to 0', () => {
      const r = computeVoiceScores(mismatchInput)
      expect(r.scores.accuracy).toBe(0)
    })

    it('sets isGibberish to true', () => {
      const r = computeVoiceScores(mismatchInput)
      expect(r.isGibberish).toBe(true)
    })

    it('returns language-specific advice', () => {
      const r = computeVoiceScores({
        ...mismatchInput,
        detectedLanguage: 'French',
      })
      expect(r.aiAdvise).toContain('English')
      expect(r.aiAdvise).toContain('French')
    })
  })

  describe('gibberish', () => {
    it('detects gibberish from long avg word length', () => {
      const r = computeVoiceScores({
        ...baseInput,
        transcript: 'x'.repeat(60),
        fillers: 0,
      })
      expect(r.isGibberish).toBe(true)
      expect(r.scores.clarity).toBeLessThan(15)
    })

    it('returns gibberish-specific advice', () => {
      const r = computeVoiceScores({
        ...baseInput,
        transcript: 'y'.repeat(60),
        fillers: 0,
      })
      expect(r.aiAdvise).toContain('unclear')
    })
  })

  describe('empty transcript', () => {
    it('returns empty speech advice', () => {
      const r = computeVoiceScores({
        ...baseInput,
        transcript: '',
        fillers: 0,
        wpm: 0,
      })
      expect(r.nextPrompt).toContain('speak')
    })
  })

  describe('emotion detection', () => {
    it('returns Confident for fast WPM + high accuracy', () => {
      const r = computeVoiceScores({
        ...baseInput,
        subject: 'brown fox jumps over lazy dog riverbank',
        wpm: 170,
      })
      expect(r.emotion).toBe('Confident')
    })

    it('returns Hesitant for many fillers', () => {
      const r = computeVoiceScores({ ...baseInput, fillers: 8, wpm: 80 })
      expect(r.emotion).toBe('Hesitant')
    })

    it('returns Unclear on mismatch', () => {
      const r = computeVoiceScores({ ...baseInput, languageMismatch: true })
      expect(r.emotion).toBe('Unclear')
    })

    it('returns Thoughtful for slow WPM', () => {
      const r = computeVoiceScores({ ...baseInput, fillers: 0, wpm: 50 })
      expect(r.emotion).toBe('Thoughtful')
    })
  })

  describe('advice generation', () => {
    it('references WPM in advice', () => {
      const r = computeVoiceScores({ ...baseInput, wpm: 200 })
      expect(r.aiAdvise).toContain('200')
    })

    it('tells slow speakers to speed up', () => {
      const r = computeVoiceScores({ ...baseInput, wpm: 50 })
      expect(r.aiAdvise).toContain('faster')
    })

    it('mentions filler count when high', () => {
      const r = computeVoiceScores({ ...baseInput, fillers: 6 })
      expect(r.aiAdvise).toContain('6')
    })

    it('comments on low phonetics', () => {
      // Filler-heavy with simple words = low phonetics
      const r = computeVoiceScores({
        ...baseInput,
        transcript: 'um like you know um so well like um',
        fillers: 6,
        wpm: 80,
      })
      expect(r.aiAdvise).toContain('vocabulary')
    })
  })

  describe('word feedback', () => {
    it('returns array matching word count', () => {
      const r = computeVoiceScores(baseInput)
      const words = baseInput.transcript.split(/\s+/)
      expect(r.wordFeedback).toHaveLength(words.length)
    })

    it('scores each word 0-100', () => {
      const r = computeVoiceScores(baseInput)
      for (const wf of r.wordFeedback || []) {
        expect(wf.score).toBeGreaterThanOrEqual(0)
        expect(wf.score).toBeLessThanOrEqual(100)
      }
    })
  })

  describe('padding', () => {
    it('generates nextPrompt for next step', () => {
      const r = computeVoiceScores(baseInput)
      expect(r.nextPrompt).toBeTruthy()
    })

    it('returns wpm and fillers in output', () => {
      const r = computeVoiceScores(baseInput)
      expect(r.wpm).toBe(120)
      expect(r.fillers).toBe(1)
    })
  })
})
