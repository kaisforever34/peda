import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Award } from "lucide-react"
import { getStudentCourses, getAvailableClassrooms } from "@/app/actions/enrollment"
import { JoinClassDialog } from "./join-class-dialog"

export default async function StudentCoursesPage() {
  const enrollments = await getStudentCourses()
  const availableClassrooms = await getAvailableClassrooms()

  return (
    <AppShell role="STUDENT">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">Track and continue your learning</p>
          </div>
          <JoinClassDialog availableClassrooms={availableClassrooms} />
        </div>

        {enrollments.length === 0 ? (
          <Card className="p-12 flex flex-col items-center justify-center text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No courses yet</h3>
            <p className="text-muted-foreground mb-6">Join a class to access your courses and starting learning.</p>
            <JoinClassDialog availableClassrooms={availableClassrooms} />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enr) => (
              <Card key={enr.id} className="overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary" />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{enr.course.title}</CardTitle>
                      <CardDescription>
                        {enr.course.subject} • {enr.course.grade}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{enr.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${enr.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{enr.course._count?.lessons || 0} lessons</span>
                      </div>
                      {enr.progress === 100 && (
                        <span className="flex items-center gap-1 text-green-600">
                          <Award className="h-4 w-4" />
                          Completed
                        </span>
                      )}
                    </div>
                    <Link href={`/student/courses/${enr.courseId}`} className="block">
                      <Button
                        variant={enr.progress === 100 ? "outline" : "default"}
                        className="w-full"
                      >
                        {enr.progress === 100 ? "Review" : enr.progress === 0 ? "Start Course" : "Continue"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}