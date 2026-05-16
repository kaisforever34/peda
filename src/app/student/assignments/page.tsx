import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SafeDate } from "@/components/ui/safe-date"
import { ClipboardList, Clock, AlertCircle, CheckCircle, FileText } from "lucide-react"
import Link from "next/link"

export default async function StudentAssignmentsPage() {
  const { userId } = await auth()

  if (!userId) {
    return (
      <AppShell role="STUDENT">
        <p className="text-muted-foreground">Please log in to view assignments.</p>
      </AppShell>
    )
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  const assignments = user ? await prisma.assignment.findMany({
    where: {
      course: {
        enrollments: {
          some: { studentId: user.id }
        }
      }
    },
    include: {
      course: { select: { id: true, title: true } },
      submissions: {
        where: { studentId: user.id },
        select: { id: true, status: true, aiScore: true, teacherScore: true }
      }
    },
    orderBy: { dueDate: "asc" }
  }) : []

  return (
    <AppShell role="STUDENT">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">Track and submit your coursework</p>
        </div>

        {assignments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ClipboardList className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">No assignments yet</h3>
                <p className="text-muted-foreground max-w-sm">
                  Your teachers haven&apos;t created any assignments for your courses yet.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const submission = assignment.submissions[0]
              const isSubmitted = !!submission
              const isOverdue = assignment.dueDate && new Date() > assignment.dueDate && !isSubmitted
              const score = submission?.teacherScore ?? submission?.aiScore

              return (
                <Card key={assignment.id} className={isOverdue ? "border-red-200" : ""}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSubmitted ? "bg-green-100 text-green-600" : isOverdue ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                        {isSubmitted ? <CheckCircle className="h-4 w-4" /> : isOverdue ? <AlertCircle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div>
                        <CardTitle className="text-base">{assignment.title}</CardTitle>
                        <CardDescription>{assignment.course.title}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isSubmitted ? (
                        <div className="flex items-center gap-2">
                          {score !== null && score !== undefined && (
                            <span className="text-lg font-bold text-primary">{Math.round(score)}%</span>
                          )}
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                            Submitted
                          </span>
                        </div>
                      ) : isOverdue ? (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-800">
                          Overdue
                        </span>
                      ) : null}
                      {assignment.dueDate && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Due <SafeDate date={assignment.dueDate} />
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  {assignment.description && (
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">{assignment.description}</p>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
