# Student Assignment Workflow & Implementation Guide

This guide outlines the technical and functional steps to assign students to classes and courses within the PEDA platform.

## 1. Data Model Overview
The platform uses two primary junction tables to handle assignments:
- **`ClassroomStudent`**: Links a `User` (Student) to a `Classroom`.
- **`Enrollment`**: Links a `User` (Student) to a `Course`.

## 2. Recommended Workflows

### A. Automatic Assignment (Via Classrooms)
The most efficient way to assign students to multiple courses is via **Classrooms**.
1. **Teacher** creates a Classroom.
2. **Teacher** links specific Courses to that Classroom.
3. **Student** joins the Classroom (either manually or via a teacher-initiated action).
4. **Platform Logic**: When a student joins a classroom, the system automatically creates `Enrollment` records for all courses linked to that classroom.

### B. Direct Course Enrollment
Used for individual course access without a classroom structure.
1. **Student** or **Teacher** triggers a direct enrollment.
2. An `Enrollment` record is created for the specific `studentId` and `courseId`.

---

## 3. Technical Implementation (Server Actions)

To programmatically assign a student to a class or course, you can use the following patterns in your server actions.

### Assigning a Student to a Classroom
Add this function to `src/app/actions/enrollment.ts` to allow teachers to manually add students:

```typescript
export async function assignStudentToClass(studentId: string, classroomId: string) {
  const { userId: teacherClerkId } = await auth();
  // ... authentication check ...

  return await prisma.$transaction(async (tx) => {
    // 1. Create the classroom-student link
    const classroomStudent = await tx.classroomStudent.create({
      data: { studentId, classroomId }
    });

    // 2. Fetch all courses linked to this classroom
    const classroom = await tx.classroom.findUnique({
      where: { id: classroomId },
      include: { courses: true }
    });

    // 3. Auto-enroll student in all linked courses
    if (classroom?.courses) {
      for (const course of classroom.courses) {
        await tx.enrollment.upsert({
          where: { studentId_courseId: { studentId, courseId: course.id } },
          create: { studentId, courseId: course.id },
          update: {}
        });
      }
    }

    return classroomStudent;
  });
}
```

### Linking a Course to a Classroom
To ensure students in a class get access to a course, update the `Course` record:

```typescript
export async function linkCourseToClassroom(courseId: string, classroomId: string) {
  return await prisma.course.update({
    where: { id: courseId },
    data: {
      classrooms: {
        connect: { id: classroomId }
      }
    }
  });
}
```

---

## 4. UI/UX Troubleshooting (Unresponsive Buttons)
If buttons in the Teacher Dashboard feel unresponsive:
1. **Check Server Action Returns**: Ensure your UI checks the `success` field of the returned object from server actions (e.g., `createCourse`).
2. **Implement Toast Feedback**: Always use `toast.success()` or `toast.error()` to inform the user that the action was triggered.
3. **Loading States**: Disable the button while `isPending` or `loading` is true to prevent double-submissions.
