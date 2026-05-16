import { describe, it, expect, vi, beforeEach } from 'vitest'
import { toggleLessonCompletion } from '../lesson'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

vi.mock('../gamification', () => ({
  updateStreak: vi.fn().mockResolvedValue({ success: true, streak: 4 }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any)
  vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'student_1', name: 'Student' } as any)
})

describe('toggleLessonCompletion', () => {
  it('calls updateStreak when completing a lesson', async () => {
    vi.mocked(prisma.lessonCompletion.findUnique).mockResolvedValue(null)

    await toggleLessonCompletion('lesson_1', 'course_1')

    const { updateStreak } = await import('../gamification')
    expect(updateStreak).toHaveBeenCalled()
  })

  it('does NOT call updateStreak when uncompleting a lesson', async () => {
    vi.mocked(prisma.lessonCompletion.findUnique).mockResolvedValue({ id: 'lc_1', studentId: 'student_1', lessonId: 'lesson_1' } as any)

    await toggleLessonCompletion('lesson_1', 'course_1')

    const { updateStreak } = await import('../gamification')
    expect(prisma.lessonCompletion.delete).toHaveBeenCalled()
    expect(updateStreak).not.toHaveBeenCalled()
  })
})
