import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Eye, Edit, Trash2 } from "lucide-react"
import { getCourses } from "@/app/actions/course"
import { CreateCourseDialog } from "./create-course-dialog"
import { CourseActions } from "@/components/teacher/course-actions"

function getStatusBadge(status: string) {
  return status === "PUBLISHED" ? (
    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Published</span>
  ) : (
    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Draft</span>
  )
}

export default async function TeacherCoursesPage() {
  const { courses, total, pages } = await getCourses(1, 100)
  
  const published = courses.filter(c => c.status === "PUBLISHED")
  const draft = courses.filter(c => c.status === "DRAFT")

  return (
    <AppShell role="TEACHER">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Courses</h1>
            <p className="text-muted-foreground">Create and manage your courses</p>
          </div>
          <CreateCourseDialog />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
            </CardContent>
          </Card>
          {/* ... other cards ... */}
        </div>

        {courses.length === 0 ? (
          <Card className="p-12 flex flex-col items-center justify-center text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No courses yet</h3>
            <p className="text-muted-foreground mb-6">Start by creating your first course to share with students.</p>
            <CreateCourseDialog />
          </Card>
        ) : (
          <>
            {published.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Published Courses</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {published.map((course) => (
                    <Card key={course.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{course.title}</CardTitle>
                            <div className="flex gap-2 mt-1">
                              <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-bold">
                                {course.grade}
                              </span>
                              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium italic">
                                {course.subject}
                              </span>
                            </div>
                          </div>
                          {getStatusBadge(course.status)}
                        </div>
                        <CardDescription>{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {course._count?.enrollments || 0} students
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {course._count?.lessons || 0} lessons
                            </div>
                          </div>
                            <CourseActions courseId={course.id} status={course.status} />
                          </div>
                        </CardContent>
                      </Card>
                  ))}
                </div>
              </div>
            )}

            {draft.length > 0 && (
              <div className="space-y-4 mt-8">
                <h2 className="text-xl font-semibold">Draft Courses</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {draft.map((course) => (
                    <Card key={course.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{course.title}</CardTitle>
                            <div className="flex gap-2 mt-1">
                              <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-bold">
                                {course.grade}
                              </span>
                              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium italic">
                                {course.subject}
                              </span>
                            </div>
                          </div>
                          {getStatusBadge(course.status)}
                        </div>
                        <CardDescription>{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {course._count?.lessons || 0} lessons
                            </div>
                          </div>
                            <CourseActions courseId={course.id} status={course.status} />
                          </div>
                        </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
          </>
        )}
      </div>
    </AppShell>
  )
}