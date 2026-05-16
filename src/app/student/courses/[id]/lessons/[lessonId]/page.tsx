import { getStudentLesson, toggleLessonCompletion } from "@/app/actions/lesson"
import { notFound } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, ChevronRight, CheckCircle, PlayCircle, FileText, HelpCircle, Clock } from "lucide-react"

export default async function StudentLessonPage({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
  const { id: courseId, lessonId } = await params
  const result = await getStudentLesson(lessonId)

  if (!result) notFound()

  const { lesson } = result
  const isCompleted = lesson.completions.length > 0

  const allLessons = lesson.module.lessons
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  return (
    <AppShell role="STUDENT">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/student/courses/${courseId}`}>
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{lesson.course.title} • {lesson.module.title}</p>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
          </div>
          <form action={toggleLessonCompletion.bind(null, lessonId, courseId)}>
            <Button type="submit" variant={isCompleted ? "outline" : "default"}>
              {isCompleted ? (
                <><CheckCircle className="h-4 w-4 mr-2" /> Completed</>
              ) : (
                "Mark as Complete"
              )}
            </Button>
          </form>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {lesson.contentType === "VIDEO" && <PlayCircle className="h-5 w-5" />}
                {lesson.contentType === "TEXT" && <FileText className="h-5 w-5" />}
                {lesson.contentType === "QUIZ" && <HelpCircle className="h-5 w-5" />}
                {lesson.contentType} Lesson
              </CardTitle>
              {lesson.duration && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {lesson.duration} min
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {lesson.contentType === "VIDEO" && lesson.videoUrl ? (
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={lesson.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            ) : lesson.contentType === "TEXT" ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {lesson.content ? (
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{lesson.content}</p>
                ) : (
                  <p className="text-muted-foreground italic">Lesson content will be added by your teacher soon.</p>
                )}
              </div>
            ) : lesson.contentType === "QUIZ" ? (
              <div className="text-center py-8 text-muted-foreground">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                <p className="font-medium">Interactive quiz feature coming soon</p>
                <p className="text-sm">Stay tuned for updates from your teacher.</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          {prevLesson ? (
            <Link href={`/student/courses/${courseId}/lessons/${prevLesson.id}`}>
              <Button variant="outline">
                <ChevronLeft className="h-4 w-4 mr-2" />
                {prevLesson.title}
              </Button>
            </Link>
          ) : (
            <div />
          )}
          {nextLesson ? (
            <Link href={`/student/courses/${courseId}/lessons/${nextLesson.id}`}>
              <Button>
                {nextLesson.title}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Link href={`/student/courses/${courseId}`}>
              <Button>Back to Course</Button>
            </Link>
          )}
        </div>
      </div>
    </AppShell>
  )
}
