import { prisma } from '../src/lib/prisma'
import { EducationLevel, CourseStatus, ExamType, LessonType } from '@prisma/client'

async function main() {
  console.log('🌱 Seeding database...')

  // Clean up in correct order (respecting foreign keys)
  await prisma.lessonCompletion.deleteMany({})
  await prisma.submission.deleteMany({})
  await prisma.enrollment.deleteMany({})
  await prisma.examQuestion.deleteMany({})
  await prisma.exam.deleteMany({})
  await prisma.assignment.deleteMany({})
  await prisma.lesson.deleteMany({})
  await prisma.module.deleteMany({})
  await prisma.classroomStudent.deleteMany({})
  await prisma.certificate.deleteMany({})
  await prisma.announcement.deleteMany({})
  await prisma.teacherNote.deleteMany({})
  await prisma.voiceSession.deleteMany({})
  await prisma.course.deleteMany({})
  await prisma.classroom.deleteMany({})
  await prisma.userBadge.deleteMany({})
  await prisma.badge.deleteMany({})
  await prisma.peerReview.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.organization.deleteMany({})

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      id: 'org_1',
      name: 'Lycée El-Mokrani Algiers',
    },
  })

  // 2. Create Users - auth() returns "user_teacher_1"
  const teacher = await prisma.user.create({
    data: {
      clerkId: 'user_teacher_1',
      name: 'Prof. Ahmed Slimani',
      email: 'teacher@peda.dz',
      role: 'TEACHER',
      organizationId: org.id,
    },
  })

  const student = await prisma.user.create({
    data: {
      clerkId: 'user_student_1',
      name: 'Yasmine Badra',
      email: 'student@peda.dz',
      role: 'STUDENT',
      organizationId: org.id,
    },
  })

  // 3. Introduction Course (Global Welcome)
  const introCourse = await prisma.course.create({
    data: {
      title: 'Bienvenue sur PEDA : Guide de démarrage',
      description: 'Apprenez à utiliser l\'IA pour booster vos résultats scolaires.',
      subject: 'Onboarding',
      level: EducationLevel.HIGH_SCHOOL,
      grade: 'All',
      teacherId: teacher.id,
      organizationId: org.id,
      status: CourseStatus.PUBLISHED,
    },
  })

  // 4. Physics Course
  const coursePhysics = await prisma.course.create({
    data: {
      title: 'Physique-Chimie : Les Mouvements',
      description: 'Module complet sur la mécanique classique pour le niveau 3ème AS.',
      subject: 'Physics',
      level: EducationLevel.HIGH_SCHOOL,
      grade: '3AS',
      teacherId: teacher.id,
      organizationId: org.id,
      status: CourseStatus.PUBLISHED,
    },
  })

  const mod1 = await prisma.module.create({
    data: { title: 'Cinématique', order: 1, courseId: coursePhysics.id },
  })

  await prisma.lesson.createMany({
    data: [
      { title: 'Vitesse et Accélération', order: 1, contentType: LessonType.TEXT, content: 'Introduction aux vecteurs vitesse...', courseId: coursePhysics.id, moduleId: mod1.id },
      { title: 'Mouvement Circulaire', order: 2, contentType: LessonType.TEXT, content: 'Étude des forces centripètes...', courseId: coursePhysics.id, moduleId: mod1.id },
    ],
  })

  // 5. Science Course
  const courseScience = await prisma.course.create({
    data: {
      title: 'Sciences Naturelles : La Géologie',
      description: "L'activité interne de la Terre pour le niveau 4ème AM.",
      subject: 'Science',
      level: EducationLevel.MIDDLE,
      grade: '4AM',
      teacherId: teacher.id,
      organizationId: org.id,
      status: CourseStatus.PUBLISHED,
    },
  })

  // 6. English Course
  const courseEnglish = await prisma.course.create({
    data: {
      title: 'English: Grammar & Composition',
      description: "Advanced grammar, essay writing, and literary analysis for Terminale.",
      subject: 'English',
      level: EducationLevel.HIGH_SCHOOL,
      grade: '3AS',
      teacherId: teacher.id,
      organizationId: org.id,
      status: CourseStatus.PUBLISHED,
    },
  })

  const modEng = await prisma.module.create({
    data: { title: 'Grammar Foundations', order: 1, courseId: courseEnglish.id },
  })

  await prisma.lesson.createMany({
    data: [
      { title: 'Tenses & Aspects', order: 1, contentType: LessonType.TEXT, content: 'Present, past, future tenses...', courseId: courseEnglish.id, moduleId: modEng.id },
      { title: 'Passive Voice', order: 2, contentType: LessonType.QUIZ, content: 'Transform active to passive...', courseId: courseEnglish.id, moduleId: modEng.id },
    ],
  })

  // 7. Draft Course
  await prisma.course.create({
    data: {
      title: 'Mathématiques : Analyse Complexe',
      description: "Fonctions holomorphes et théorème des résidus (Brouillon).",
      subject: 'Mathematics',
      level: EducationLevel.HIGH_SCHOOL,
      grade: '3AS',
      teacherId: teacher.id,
      organizationId: org.id,
      status: CourseStatus.DRAFT,
    },
  })

  // 8. Written Exam (Physics)
  const examPhysics = await prisma.exam.create({
    data: {
      title: 'Quiz de Mécanique (3AS)',
      description: 'Évaluation écrite sur les lois de Newton.',
      type: ExamType.WRITTEN,
      courseId: coursePhysics.id,
      timeLimit: 45,
      status: 'PUBLISHED',
    },
  })

  await prisma.examQuestion.createMany({
    data: [
      { examId: examPhysics.id, question: 'Quelle est la deuxième loi de Newton ?', order: 1, points: 5 },
      { examId: examPhysics.id, question: 'Calculer la force d\'attraction entre deux masses de 5 kg et 10 kg distants de 2 m.', order: 2, points: 5 },
      { examId: examPhysics.id, question: 'Expliquez le principe d\'inertie en donnant un exemple concret.', order: 3, points: 10 },
    ],
  })

  // 9. Voice Exam (Science)
  await prisma.exam.create({
    data: {
      title: 'Oral: Tectonique des Plaques',
      description: 'Présentation orale sur le mouvement des continents.',
      type: ExamType.VOICE,
      voiceSubject: 'Exposez les preuves de la dérive des continents selon Wegener.',
      courseId: courseScience.id,
      timeLimit: 15,
      status: 'PUBLISHED',
    },
  })

  // 10. Written Exam (English)
  const examEnglish = await prisma.exam.create({
    data: {
      title: 'Grammar Test - Terminals S1',
      description: 'Mixed tenses and passive voice transformation.',
      type: ExamType.WRITTEN,
      courseId: courseEnglish.id,
      timeLimit: 30,
      status: 'PUBLISHED',
    },
  })

  await prisma.examQuestion.createMany({
    data: [
      { examId: examEnglish.id, question: 'Rewrite in passive voice: "The students wrote the essays."', order: 1, points: 2 },
      { examId: examEnglish.id, question: 'Fill in the blanks: By next week, we ___ (complete) the project.', order: 2, points: 2 },
      { examId: examEnglish.id, question: 'Write a paragraph discussing the impact of technology on education.', order: 3, points: 6 },
    ],
  })

  // 11. Assignments
  const assignment1 = await prisma.assignment.create({
    data: {
      title: 'Rapport de laboratoire : Pendule simple',
      description: 'Rédigez un rapport complet sur l\'expérience du pendule simple.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      courseId: coursePhysics.id,
      aiEnabled: true,
    },
  })

  const assignment2 = await prisma.assignment.create({
    data: {
      title: 'Essay: Climate Change',
      description: 'Write a 500-word essay on the causes and effects of climate change.',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      courseId: courseEnglish.id,
      aiEnabled: true,
    },
  })

  // 12. Classroom
  const classroom = await prisma.classroom.create({
    data: {
      title: 'Terminales S1 - 2026',
      description: 'Classes scientifiques préparant le BAC 2026.',
      level: EducationLevel.HIGH_SCHOOL,
      grade: '3AS',
      branch: 'Science',
      teacherId: teacher.id,
      organizationId: org.id,
    },
  })

  await prisma.classroomStudent.create({
    data: { classroomId: classroom.id, studentId: student.id },
  })

  // 13. Enroll the teacher in courses AND submissions so student pages show data
  // The auth() returns "user_teacher_1" so the demo user sees data everywhere
  await prisma.enrollment.create({
    data: {
      studentId: teacher.id,
      courseId: coursePhysics.id,
      progress: 100,
    },
  })

  await prisma.enrollment.create({
    data: {
      studentId: teacher.id,
      courseId: courseEnglish.id,
      progress: 60,
    },
  })

  await prisma.enrollment.create({
    data: {
      studentId: teacher.id,
      courseId: courseScience.id,
      progress: 30,
    },
  })

  await prisma.enrollment.create({
    data: {
      studentId: student.id,
      courseId: coursePhysics.id,
      progress: 45,
    },
  })

  // 14. Submissions (so student results page shows data)
  const aiFeedback = "Bon travail ! Votre réponse démontre une bonne compréhension des lois de Newton. Pour améliorer votre score, essayez d'ajouter des formules mathématiques et des exemples concrets."

  await prisma.submission.create({
    data: {
      studentId: teacher.id,
      assignmentId: assignment1.id,
      answers: { question1: 'La deuxième loi de Newton stipule que...', question2: 'F = G * m1 * m2 / d^2' },
      aiScore: 78,
      aiFeedback,
      status: 'AI_REVIEWED',
    },
  })

  await prisma.submission.create({
    data: {
      studentId: teacher.id,
      assignmentId: assignment2.id,
      answers: { essay: 'Climate change is one of the most pressing issues...' },
      aiScore: 85,
      aiFeedback: aiFeedback.replace('lois', 'essay'),
      status: 'AI_REVIEWED',
    },
  })

  await prisma.submission.create({
    data: {
      studentId: teacher.id,
      examId: examPhysics.id,
      answers: { q1: 'F = ma', q2: 'F = 6.67e-11 * 5 * 10 / 4' },
      aiScore: 92,
      aiFeedback: aiFeedback.replace('lois', 'lois de Newton'),
      teacherScore: 90,
      teacherFeedback: 'Excellent travail ! Continuez ainsi.',
      status: 'GRADED',
    },
  })

  await prisma.submission.create({
    data: {
      studentId: teacher.id,
      examId: examEnglish.id,
      answers: { q1: 'The essays were written by the students.', q2: 'will have completed' },
      aiScore: 72,
      aiFeedback: aiFeedback.replace('lois', 'grammar concepts'),
      status: 'AI_REVIEWED',
    },
  })

  // 15. Voice Sessions
  await prisma.voiceSession.create({
    data: {
      studentId: teacher.id,
      prompt: 'Présentez-vous en français et parlez de vos études.',
      transcript: 'Bonjour, je m\'appelle Ahmed. Je suis professeur de physique au lycée...',
      scores: { pronunciation: 85, fluency: 72, grammar: 90 },
      feedback: { strengths: 'Bonne prononciation', improvements: 'Parler plus lentement' },
      pace: 3.2,
      clarity: 0.85,
      confidence: 0.78,
      duration: 45,
    },
  })

  await prisma.voiceSession.create({
    data: {
      studentId: teacher.id,
      prompt: 'Expliquez le théorème de Pythagore.',
      transcript: 'Le théorème de Pythagore stipule que dans un triangle rectangle...',
      scores: { pronunciation: 92, fluency: 85, grammar: 95 },
      feedback: { strengths: 'Excellent contenu', improvements: 'Rien à signaler' },
      pace: 4.1,
      clarity: 0.92,
      confidence: 0.88,
      duration: 120,
    },
  })

  await prisma.voiceSession.create({
    data: {
      studentId: student.id,
      prompt: 'Parlez de votre matière préférée.',
      transcript: 'Ma matière préférée est la physique car j\'aime comprendre...',
      scores: { pronunciation: 65, fluency: 55, grammar: 70 },
      feedback: { strengths: 'Bon vocabulaire', improvements: 'Travailler la fluidité' },
      pace: 2.8,
      clarity: 0.7,
      confidence: 0.6,
      duration: 60,
    },
  })

  // 16. Badges
  await prisma.badge.createMany({
    data: [
      { name: 'The First Step', description: 'Complete your first submission', icon: 'Flag', color: 'text-blue-500', criteria: 'SUBMISSIONS:1' },
      { name: 'Consistent Learner', description: 'Maintain a 3-day streak', icon: 'Zap', color: 'text-orange-500', criteria: 'STREAK:3' },
      { name: 'Master Orator', description: 'Complete 10 voice sessions', icon: 'Mic', color: 'text-purple-500', criteria: 'SUBMISSIONS:10' },
      { name: 'Quiz Champion', description: 'Score 90%+ on any exam', icon: 'Trophy', color: 'text-yellow-500', criteria: 'SUBMISSIONS:1' },
    ],
  })

  // 17. Certificates
  await prisma.certificate.create({
    data: {
      studentId: teacher.id,
      courseId: coursePhysics.id,
    },
  })

  // 18. Announcement
  await prisma.announcement.create({
    data: {
      title: '📢 Devoir surveillé - Samedi prochain',
      content: 'Un devoir surveillé aura lieu samedi prochain sur les chapitres 1 à 3. Préparez-vous bien !',
      teacherId: teacher.id,
    },
  })

  console.log('✅ Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
