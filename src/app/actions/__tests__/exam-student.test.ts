import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitWrittenExam } from '../exam-student'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

vi.mock('../gamification', () => ({
  updateStreak: vi.fn().mockResolvedValue({ success: true, streak: 6 }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any)
  vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'student_1', name: 'Test Student', role: 'STUDENT' } as any)
  vi.mocked(prisma.exam.findUnique).mockResolvedValue({
    id: 'exam_1',
    title: 'Math Test',
    course: { id: 'course_1', title: 'Math 101' }
  } as any)
  vi.mocked(prisma.enrollment.findUnique).mockResolvedValue({ id: 'enr_1', studentId: 'student_1', courseId: 'course_1' } as any)
  vi.mocked(prisma.submission.create).mockResolvedValue({ id: 'sub_1' } as any)
})

describe('submitWrittenExam', () => {
  it('creates a submission with answers and returns success', async () => {
    const result = await submitWrittenExam('exam_1', { q1: 'answer A', q2: 'answer B' })

    expect(prisma.submission.create).toHaveBeenCalledWith({
      data: {
        studentId: 'student_1',
        examId: 'exam_1',
        answers: { q1: 'answer A', q2: 'answer B' },
        status: 'PENDING'
      }
    })
    expect(result).toEqual({ success: true })
  })

  it('checks user is enrolled in the course', async () => {
    vi.mocked(prisma.enrollment.findUnique).mockResolvedValue(null)

    const result = await submitWrittenExam('exam_1', { q1: 'a' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/enrolled/i)
    expect(prisma.submission.create).not.toHaveBeenCalled()
  })

  it('returns error if exam not found', async () => {
    vi.mocked(prisma.exam.findUnique).mockResolvedValue(null)

    const result = await submitWrittenExam('exam_x', { q1: 'a' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/not found/i)
  })

  it('returns error if not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any)

    const result = await submitWrittenExam('exam_1', { q1: 'a' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/unauthorized/i)
  })

  it('returns error if user not found in db', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const result = await submitWrittenExam('exam_1', { q1: 'a' })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/not found/i)
  })

  it('calls updateStreak on successful submission', async () => {
    const { updateStreak } = await import('../gamification')

    await submitWrittenExam('exam_1', { q1: 'a' })

    expect(updateStreak).toHaveBeenCalled()
  })
})
