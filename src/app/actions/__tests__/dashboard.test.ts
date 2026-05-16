import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getStudentDashboardData, getTeacherDashboardData } from '../dashboard'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

vi.mock('@/lib/analytics', () => ({
  getStudentPerformanceProjection: vi.fn().mockResolvedValue({
    currentScore: 75,
    projectedScore: 80,
    trend: 'UP',
    confidence: 60,
    breakdown: { self: 70, ai: 80, peer: 65, teacher: 75 }
  }),
  getClassroomPerformanceTrends: vi.fn().mockResolvedValue([]),
}))

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any)
  vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'student_1', name: 'Test Student', points: 500, streak: 3, badges: [] } as any)
  vi.mocked(prisma.enrollment.findMany).mockResolvedValue([])
  vi.mocked(prisma.assignment.findMany).mockResolvedValue([])
  vi.mocked(prisma.exam.findMany).mockResolvedValue([])
  vi.mocked(prisma.announcement.findMany).mockResolvedValue([])
  vi.mocked(prisma.classroom.findMany).mockResolvedValue([])
  vi.mocked(prisma.course.findMany).mockResolvedValue([])
})

describe('getStudentDashboardData', () => {
  it('returns dashboard data with enrollments and assignments', async () => {
    const result = await getStudentDashboardData()

    expect(result.userName).toBe('Test Student')
    expect(result.points).toBe(500)
    expect(result.streak).toBe(3)
    expect(Array.isArray(result.enrollments)).toBe(true)
    expect(Array.isArray(result.assignments)).toBe(true)
  })

  it('includes performanceProjection when available', async () => {
    const result = await getStudentDashboardData()

    expect(result.performanceProjection).toBeDefined()
    expect(result.performanceProjection?.currentScore).toBe(75)
    expect(result.performanceProjection?.trend).toBe('UP')
  })

  it('returns empty defaults when db throws', async () => {
    vi.mocked(prisma.enrollment.findMany).mockRejectedValue(new Error('DB down'))

    const result = await getStudentDashboardData()

    expect(result.enrollments).toEqual([])
    expect(result.assignments).toEqual([])
    expect(result.exams).toEqual([])
    expect(result.points).toBe(0)
    expect(result.streak).toBe(0)
    expect(result.badges).toEqual([])
    expect(result.userName).toBe('Student')
  })
})

describe('getTeacherDashboardData', () => {
  it('returns teacher dashboard data', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'teacher_1', name: 'Ms. Smith', role: 'TEACHER' } as any)
    vi.mocked(prisma.classroom.findMany).mockResolvedValue([
      { id: 'class_1', teacherId: 'teacher_1', _count: { students: 5 } } as any,
    ])

    const result = await getTeacherDashboardData()

    expect(Array.isArray(result.courses)).toBe(true)
    expect(Array.isArray(result.classrooms)).toBe(true)
    expect(result.classrooms.length).toBe(1)
  })

  it('returns empty defaults when db throws', async () => {
    vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error('DB down'))

    const result = await getTeacherDashboardData()

    expect(result.courses).toEqual([])
    expect(result.classrooms).toEqual([])
    expect(result.assignments).toEqual([])
    expect(result.exams).toEqual([])
    expect(result.announcements).toEqual([])
  })
})
