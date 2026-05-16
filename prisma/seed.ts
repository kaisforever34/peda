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
  await prisma.user.deleteMany({})
  await prisma.organization.deleteMany({})

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      id: 'org_1',
      name: 'Lycée El-Mokrani Algiers',
    },
  })

  // 2. Create Users
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

  // 3. Create Introduction Course (Global Welcome)
  const introCourse = await prisma.course.create({
    data: {
      id: 'course_intro',
      title: 'Bienvenue sur PEDA : Guide de démarrage',
      description: 'Apprenez à utiliser l\'IA pour booster vos résultats scolaires.',
      subject: 'Onboarding',
      level: EducationLevel.HIGH_SCHOOL,
      grade: 'All',
      teacherId: teacher.id,
      organizationId: org.id,
      status: CourseStatus.PUBLISHED,
    }
  })

  // 4. Create Physics Course with Module & Lessons
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
    }
  })

  const mod1 = await prisma.module.create({
    data: {
      title: 'Cinématique',
      order: 1,
      courseId: coursePhysics.id,
    }
  })

  await prisma.lesson.createMany({
    data: [
      { title: 'Vitesse et Accélération', order: 1, contentType: LessonType.TEXT, content: 'Introduction aux vecteurs vitesse...', courseId: coursePhysics.id, moduleId: mod1.id },
      { title: 'Mouvement Circulaire', order: 2, contentType: LessonType.TEXT, content: 'Étude des forces centripètes...', courseId: coursePhysics.id, moduleId: mod1.id },
    ]
  })

  // 4. Create Written Exam with Questions
  const exam1 = await prisma.exam.create({
    data: {
      title: 'Quiz de Mécanique (3AS)',
      description: 'Évaluation écrite sur les lois de Newton.',
      type: ExamType.WRITTEN,
      courseId: coursePhysics.id,
      timeLimit: 45,
      status: 'PUBLISHED',
    }
  })

  await prisma.examQuestion.createMany({
    data: [
      { examId: exam1.id, question: "Quelle est la deuxième loi de Newton ?", order: 1, points: 5 },
      { examId: exam1.id, question: "Calculer la force d'attraction entre deux masses...", order: 2, points: 5 },
    ]
  })

  // 5. Create Science Course with Voice Exam
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
    }
  })

  await prisma.exam.create({
    data: {
      title: 'Oral: Tectonique des Plaques',
      description: 'Présentation orale sur le mouvement des continents.',
      type: ExamType.VOICE,
      voiceSubject: 'Exposez les preuves de la dérive des continents selon Wegener.',
      courseId: courseScience.id,
      timeLimit: 15,
      status: 'PUBLISHED',
    }
  })

  // 6. Create Classroom & Enroll Student
  const classroom = await prisma.classroom.create({
    data: {
      title: 'Terminales S1 - 2026',
      level: EducationLevel.HIGH_SCHOOL,
      grade: '3AS',
      branch: 'Science',
      teacherId: teacher.id,
      organizationId: org.id,
    }
  })

  await prisma.classroomStudent.create({
    data: {
      classroomId: classroom.id,
      studentId: student.id
    }
  })

  // 7. Enrollment for direct course access
  await prisma.enrollment.create({
    data: {
      studentId: student.id,
      courseId: coursePhysics.id,
      progress: 45,
    }
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
