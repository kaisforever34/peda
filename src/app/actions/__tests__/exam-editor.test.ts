import { describe, it, expect, vi, beforeEach } from 'vitest'
import { deleteExamQuestion } from '../exam-editor'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(auth).mockResolvedValue({ userId: 'teacher_123' } as any)
  vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'teacher_1', name: 'Ms. Smith', role: 'TEACHER' } as any)
  vi.mocked(prisma.examQuestion.findUnique).mockResolvedValue({
    id: 'q_1',
    examId: 'exam_1',
    exam: { id: 'exam_1', course: { teacherId: 'teacher_1' } }
  } as any)
  vi.mocked(prisma.examQuestion.delete).mockResolvedValue({ id: 'q_1' } as any)
})

describe('deleteExamQuestion', () => {
  it('deletes the question and revalidates', async () => {
    const result = await deleteExamQuestion('q_1')

    expect(prisma.examQuestion.delete).toHaveBeenCalledWith({ where: { id: 'q_1' } })
    expect(revalidatePath).toHaveBeenCalledWith('/teacher/exams/exam_1')
    expect(result).toEqual({ success: true })
  })

  it('rejects non-teacher users', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'student_1', name: 'Student', role: 'STUDENT' } as any)

    await expect(deleteExamQuestion('q_1')).rejects.toThrow(/teacher/i)
    expect(prisma.examQuestion.delete).not.toHaveBeenCalled()
  })

  it('rejects if user does not own the exam', async () => {
    vi.mocked(prisma.examQuestion.findUnique).mockResolvedValue({
      id: 'q_1',
      examId: 'exam_2',
      exam: { id: 'exam_2', course: { teacherId: 'other_teacher' } }
    } as any)

    await expect(deleteExamQuestion('q_1')).rejects.toThrow(/forbidden/i)
    expect(prisma.examQuestion.delete).not.toHaveBeenCalled()
  })

  it('rejects unauthenticated requests', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any)

    await expect(deleteExamQuestion('q_1')).rejects.toThrow(/unauthorized/i)
  })

  it('rejects if question not found', async () => {
    vi.mocked(prisma.examQuestion.findUnique).mockResolvedValue(null)

    await expect(deleteExamQuestion('q_x')).rejects.toThrow(/forbidden/i)
  })
})
