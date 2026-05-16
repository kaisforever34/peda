import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitVoiceExam } from '../voice-submission'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

vi.mock('../gamification', () => ({
  updateStreak: vi.fn().mockResolvedValue({ success: true, streak: 4 }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any)
  vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'student_1', name: 'Student' } as any)
  vi.mocked(prisma.exam.findUnique).mockResolvedValue({
    id: 'exam_1',
    title: 'Voice Test',
    course: { id: 'course_1', title: 'English' }
  } as any)
  vi.mocked(prisma.enrollment.findUnique).mockResolvedValue({ id: 'enr_1', studentId: 'student_1', courseId: 'course_1' } as any)
  vi.mocked(prisma.submission.create).mockResolvedValue({ id: 'sub_1' } as any)
  vi.mocked(prisma.voiceSession.create).mockResolvedValue({ id: 'vs_1' } as any)
})

const mockResults = {
  scores: { clarity: 80, pace: 75, accuracy: 90, phonetics: 85 },
  wpm: 140,
  fillers: 3,
  isGibberish: false,
  aiAdvise: 'Good pace, try to slow down on technical terms.',
  emotion: 'neutral',
}

describe('submitVoiceExam', () => {
  it('creates submission, voice session, and calls updateStreak', async () => {
    const result = await submitVoiceExam('exam_1', mockResults, 'Hello world')

    expect(prisma.submission.create).toHaveBeenCalled()
    expect(prisma.voiceSession.create).toHaveBeenCalled()
    const { updateStreak } = await import('../gamification')
    expect(updateStreak).toHaveBeenCalled()
    expect(result.success).toBe(true)
  })

  it('returns error if not enrolled', async () => {
    vi.mocked(prisma.enrollment.findUnique).mockResolvedValue(null)

    const result = await submitVoiceExam('exam_1', mockResults, 'Hello')

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/enrolled/i)
  })
})
