import { z } from "zod";
import { ExamType, CourseStatus, EducationLevel } from "@prisma/client";

export const examSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  type: z.nativeEnum(ExamType),
  voiceSubject: z.string().optional(),
  courseId: z.string().min(1, "Course is required"),
  timeLimit: z.preprocess((val) => Number(val), z.number().min(1).optional()),
  passingScore: z.preprocess((val) => Number(val), z.number().min(0).max(100).default(60)),
});

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  subject: z.string().optional(),
  grade: z.string().optional(),
  status: z.nativeEnum(CourseStatus).default(CourseStatus.DRAFT),
});

export const classroomSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  level: z.nativeEnum(EducationLevel).optional(),
  grade: z.string().optional(),
  branch: z.string().optional(),
});

export const assignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  courseId: z.string().min(1, "Course is required"),
  dueDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  peerReviewEnabled: z.preprocess((val) => val === "on", z.boolean().default(false)),
  peerReviewsRequired: z.preprocess((val) => Number(val), z.number().min(1).max(5).default(1)),
});
