import { prisma } from "./prisma";

export interface ScoreData {
  selfScore: number | null;
  aiScore: number | null;
  peerScore: number | null;
  teacherScore: number | null;
  date: Date;
}

export interface PerformanceProjection {
  currentScore: number;
  projectedScore: number;
  trend: "UP" | "DOWN" | "STABLE";
  confidence: number; // 0-100
  breakdown: {
    self: number;
    ai: number;
    peer: number;
    teacher: number;
  };
}

const WEIGHTS = {
  TEACHER: 0.4,
  AI: 0.3,
  PEER: 0.2,
  SELF: 0.1,
};

/**
 * Calculates a weighted average score from multi-layered data points.
 */
export function calculateWeightedScore(data: Omit<ScoreData, "date">): number {
  let totalWeight = 0;
  let weightedSum = 0;

  if (data.teacherScore !== null) {
    weightedSum += data.teacherScore * WEIGHTS.TEACHER;
    totalWeight += WEIGHTS.TEACHER;
  }
  if (data.aiScore !== null) {
    weightedSum += data.aiScore * WEIGHTS.AI;
    totalWeight += WEIGHTS.AI;
  }
  if (data.peerScore !== null) {
    weightedSum += data.peerScore * WEIGHTS.PEER;
    totalWeight += WEIGHTS.PEER;
  }
  if (data.selfScore !== null) {
    weightedSum += data.selfScore * WEIGHTS.SELF;
    totalWeight += WEIGHTS.SELF;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * Projects student performance based on historical multi-layered scores.
 */
export async function getStudentPerformanceProjection(studentId: string): Promise<PerformanceProjection> {
  const submissions = await prisma.submission.findMany({
    where: { studentId },
    include: {
      peerReviews: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10, // Analyze last 10 submissions
  });

  if (submissions.length === 0) {
    return {
      currentScore: 0,
      projectedScore: 0,
      trend: "STABLE",
      confidence: 0,
      breakdown: { self: 0, ai: 0, peer: 0, teacher: 0 },
    };
  }

  const scores: number[] = submissions.map((sub) => {
    const peerScore = sub.peerReviews.length > 0 
      ? sub.peerReviews.reduce((acc, pr) => acc + pr.score, 0) / sub.peerReviews.length 
      : null;
    
    return calculateWeightedScore({
      teacherScore: sub.teacherScore,
      aiScore: sub.aiScore,
      peerScore,
      selfScore: sub.selfScore,
    });
  });

  const currentScore = scores[0];
  
  // Simple linear regression or moving average for projection
  // Here we use a simple trend analysis
  let projectedScore = currentScore;
  let trend: "UP" | "DOWN" | "STABLE" = "STABLE";

  if (scores.length >= 2) {
    const recentAvg = (scores[0] + (scores[1] || scores[0])) / 2;
    const olderAvg = scores.slice(2).length > 0 
      ? scores.slice(2).reduce((a, b) => a + b, 0) / scores.slice(2).length
      : scores[0];
    
    const diff = recentAvg - olderAvg;
    projectedScore = Math.max(0, Math.min(100, currentScore + diff * 0.5));
    
    if (diff > 2) trend = "UP";
    else if (diff < -2) trend = "DOWN";
  }

  // Calculate breakdown for the latest submission
  const latest = submissions[0];
  const latestPeerScore = latest.peerReviews.length > 0 
    ? latest.peerReviews.reduce((acc, pr) => acc + pr.score, 0) / latest.peerReviews.length 
    : 0;

  return {
    currentScore: Math.round(currentScore),
    projectedScore: Math.round(projectedScore),
    trend,
    confidence: Math.min(100, submissions.length * 10), // Confidence grows with data points
    breakdown: {
      self: latest.selfScore || 0,
      ai: latest.aiScore || 0,
      peer: latestPeerScore,
      teacher: latest.teacherScore || 0,
    },
  };
}

/**
 * Gets aggregated performance data for a teacher's classroom.
 */
export async function getClassroomPerformanceTrends(classroomId: string) {
  const students = await prisma.classroomStudent.findMany({
    where: { classroomId },
    select: { studentId: true },
  });

  const studentIds = students.map((s) => s.studentId);

  const submissions = await prisma.submission.findMany({
    where: { studentId: { in: studentIds } },
    include: {
      peerReviews: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Group by date (simplified to day)
  const dailyStats: Record<string, { total: number; count: number }> = {};

  submissions.forEach((sub) => {
    const dateKey = sub.createdAt.toISOString().split("T")[0];
    const peerScore = sub.peerReviews.length > 0 
      ? sub.peerReviews.reduce((acc, pr) => acc + pr.score, 0) / sub.peerReviews.length 
      : null;
    
    const score = calculateWeightedScore({
      teacherScore: sub.teacherScore,
      aiScore: sub.aiScore,
      peerScore,
      selfScore: sub.selfScore,
    });

    if (!dailyStats[dateKey]) {
      dailyStats[dateKey] = { total: 0, count: 0 };
    }
    dailyStats[dateKey].total += score;
    dailyStats[dateKey].count += 1;
  });

  return Object.entries(dailyStats).map(([date, stats]) => ({
    date,
    averageScore: Math.round(stats.total / stats.count),
  }));
}
