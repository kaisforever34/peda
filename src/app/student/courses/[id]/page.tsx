import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, CheckCircle, ChevronLeft, Clock, BookOpen } from "lucide-react"
import { getCourseDetail } from "@/app/actions/enrollment"
import { notFound } from "next/navigation"

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const enrollment = await getCourseDetail(id)

  if (!enrollment) {
    notFound()
  }

  const course = enrollment.course
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedLessons = course.modules.reduce((acc, m) => 
    acc + m.lessons.filter(l => l.completions.length > 0).length, 0
  )
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const nextLesson = course.modules
    .flatMap(m => m.lessons)
    .find(l => l.completions.length === 0)

  return (
    <AppShell role="STUDENT">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/student/courses">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">By {course.teacher.name} • {course.subject} {course.grade}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About this course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{course.description}</p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Course Content</h2>
              {course.modules.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground border rounded-lg border-dashed">
                  No modules added yet to this course.
                </div>
              ) : (
                course.modules.map((module, moduleIndex) => (
                  <Card key={module.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-primary">Module {moduleIndex + 1}: {module.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {module.lessons.map((lesson) => {
                        const isCompleted = lesson.completions.length > 0
                        return (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{lesson.title}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duration || 0} min
                                </span>
                                <span className="uppercase">{lesson.contentType}</span>
                              </div>
                            </div>
                            <Link href={`/student/courses/${course.id}/lessons/${lesson.id}`}>
                              <Button variant={isCompleted ? "outline" : "default"} size="sm">
                                {isCompleted ? "Review" : "Start"}
                              </Button>
                            </Link>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{progress}%</div>
                  <p className="text-sm text-muted-foreground">Complete</p>
                </div>
                <div className="h-3 rounded-full bg-secondary">
                  <div
                    className="h-3 rounded-full bg-primary"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  {completedLessons} of {totalLessons} lessons completed
                </div>
              </CardContent>
            </Card>

            {nextLesson && (
              <Card className="border-primary/20 bg-primary/5 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Continue Learning</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-medium">{nextLesson.title}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {nextLesson.duration || 0} min
                  </p>
                  <Link href={`/student/courses/${course.id}/lessons/${nextLesson.id}`}>
                    <Button className="w-full">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start Lesson
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}