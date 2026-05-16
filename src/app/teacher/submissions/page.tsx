import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Brain, User, FileText } from "lucide-react"
import { getSubmissions } from "@/app/actions/submission"
import { autoGradeSubmission } from "@/app/actions/grading"
import { SafeDate } from "@/components/ui/safe-date"
import { TeacherNotesDialog } from "@/components/teacher/teacher-notes-dialog"
import { SubmissionAIHelper } from "@/components/teacher/submission-ai-helper"
import { SubmissionReviewButton } from "@/components/teacher/submission-review-button"

function getStatusBadge(status: string) {
  switch (status) {
    case "AI_REVIEWED":
      return (
        <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
          <Brain className="h-3 w-3" />
          AI Reviewed
        </span>
      )
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
          <Clock className="h-3 w-3" />
          Pending
        </span>
      )
    case "GRADED":
      return (
        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
          <CheckCircle className="h-3 w-3" />
          Graded
        </span>
      )
    default:
      return null
  }
}

export default async function TeacherSubmissionsPage() {
  const submissions = await getSubmissions()
  const pending = submissions.filter(s => s.status === "PENDING")
  const aiReviewed = submissions.filter(s => s.status === "AI_REVIEWED")
  const graded = submissions.filter(s => s.status === "GRADED")

  return (
    <AppShell role="TEACHER">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Submissions</h1>
          <p className="text-muted-foreground">Review and grade student work</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{pending.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">AI Reviewed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{aiReviewed.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Graded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{graded.length}</div>
            </CardContent>
          </Card>
        </div>

        {submissions.length === 0 ? (
          <Card className="p-12 flex flex-col items-center justify-center text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No submissions yet</h3>
            <p className="text-muted-foreground">Student work will appear here once they complete assignments or exams.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Ready for Review</h2>
            <div className="space-y-3">
              {submissions.map((submission) => (
                <Card key={submission.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{submission.student.name}</h3>
                          {getStatusBadge(submission.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {submission.assignment?.title || submission.exam?.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted <SafeDate date={submission.createdAt} />
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {submission.aiScore !== null && (
                          <div className="text-center px-4">
                            <div className="text-lg font-bold text-blue-600">{submission.aiScore}</div>
                            <p className="text-[10px] text-muted-foreground uppercase">AI Score</p>
                          </div>
                        )}

                        {submission.status === "PENDING" && (
                          <form action={async () => {
                            "use server"
                            await autoGradeSubmission(submission.id)
                          }}>
                            <Button type="submit" variant="secondary" size="sm" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                              <Brain className="h-4 w-4 mr-1" /> AI Grade
                            </Button>
                          </form>
                        )}
                        <SubmissionAIHelper 
                          studentName={submission.student.name} 
                          assignmentTitle={submission.assignment?.title || submission.exam?.title || "Work"} 
                          score={submission.aiScore}
                        />
                        <TeacherNotesDialog studentId={submission.student.id} studentName={submission.student.name} />
                        <SubmissionReviewButton submissionId={submission.id} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}