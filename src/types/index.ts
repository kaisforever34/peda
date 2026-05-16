import { 
  User, 
  Course, 
  Classroom, 
  Assignment, 
  Exam, 
  Enrollment, 
  Submission, 
  VoiceSession,
  CourseStatus,
  EducationLevel,
  ExamType,
  SubmissionStatus,
  Announcement
} from "@prisma/client";

export type {
  User,
  Course,
  Classroom,
  Assignment,
  Exam,
  Enrollment,
  Submission,
  VoiceSession,
  Announcement
};

export interface ClassroomWithCount extends Classroom {
  _count?: {
    students: number;
  };
}

export interface CourseWithRelations extends Course {
  _count?: {
    lessons: number;
    enrollments: number;
    assignments: number;
    exams: number;
  };
}

export interface EnrollmentWithCourse extends Enrollment {
  course: Course;
}

export interface AnnouncementWithTeacher extends Announcement {
  teacher: User;
}

export interface WordFeedback {
  word: string;
  score: number; // 0-100
}

export interface VoiceResults {
  scores: {
    clarity: number;
    pace: number;
    accuracy: number;
    phonetics: number;
  };
  wpm: number;
  fillers: number;
  isGibberish: boolean;
  aiAdvise: string;
  emotion?: string;
  nextPrompt?: string;
  wordFeedback?: WordFeedback[];
}

export interface TeacherDashboardData {
  courses: Course[];
  classrooms: ClassroomWithCount[];
  assignments: Assignment[];
  exams: Exam[];
  performanceData: { date: string; averageScore: number }[];
  announcements: Announcement[];
}

export interface PerformanceProjection {
  currentScore: number;
  projectedScore: number;
  trend: "UP" | "DOWN" | "STABLE";
  confidence: number;
  breakdown: {
    self: number;
    ai: number;
    peer: number;
    teacher: number;
  };
}

export interface StudentDashboardData {
  userName: string;
  enrollments: EnrollmentWithCourse[];
  assignments: Assignment[];
  exams: Exam[];
  points: number;
  streak: number;
  badges: any[]; // Using any for simplicity with relation
  announcements: AnnouncementWithTeacher[];
  leaderboard: { id: string; name: string; points: number }[];
  performanceProjection?: {
    currentScore: number;
    projectedScore: number;
    trend: "UP" | "DOWN" | "STABLE";
    confidence: number;
    breakdown: {
      self: number;
      ai: number;
      peer: number;
      teacher: number;
    };
  };
}
