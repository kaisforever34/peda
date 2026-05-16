import { AppShell } from "@/components/layout/app-shell"
import { getCourseWithSyllabus } from "@/app/actions/course-builder"
import { CourseBuilderClient } from "./course-builder"
import { notFound } from "next/navigation"

export default async function TeacherCourseBuilderPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const course = await getCourseWithSyllabus(params.id)

  if (!course) {
    notFound()
  }

  return (
    <AppShell role="TEACHER">
      <CourseBuilderClient 
        courseId={course.id} 
        initialTitle={course.title}
        initialModules={course.modules}
      />
    </AppShell>
  )
}
