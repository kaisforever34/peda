import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, User, Calendar, BookOpen, Brain, CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import { getSubmission } from "@/app/actions/submission"
import { notFound } from "next/navigation"
import { SafeDate } from "@/components/ui/safe-date"
import { GradingForm } from "./grading-form"

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const submission = await getSubmission(id)

  if (!submission) {
    notFound()
  }

  const title = submission.assignment?.title || submission.exam?.title || "Submission"
  const course = submission.assignment?.course || submission.exam?.course

  return (
    <AppShell role="TEACHER">
      <div className="space-y-6">
        <Link href="/teacher/submissions">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Submissions
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {submission.student.name}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <SafeDate date={submission.createdAt} />
              </div>
              {course && (
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {course.title}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Request Revision</Button>
            <Button>Finalize Grade</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Work</CardTitle>
                <CardDescription>
                  The content submitted by the student.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  {typeof submission.answers === 'string' ? (
                    <p>{submission.answers}</p>
                  ) : (
                    <pre className="p-4 bg-muted rounded-lg overflow-auto">
                      {JSON.stringify(submission.answers, null, 2)}
                    </pre>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {submission.aiScore !== null ? (
                  <>
                    <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                      <div className="text-4xl font-black text-blue-600 dark:text-blue-400">
                        {submission.aiScore}/100
                      </div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mt-1 uppercase tracking-wider">
                        AI Recommended Score
                      </p>
                    </div>
                    {submission.aiFeedback && (
                      <div className="text-sm text-muted-foreground italic bg-muted/50 p-4 rounded-lg">
                        "{submission.aiFeedback}"
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>AI Review pending or not requested.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {submission.selfScore !== null && (
              <Card className="border-emerald-200 bg-emerald-50/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-emerald-700">
                    <User className="h-5 w-5" />
                    Student Self-Evaluation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-black text-emerald-600">
                      {submission.selfScore}%
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      Student assessed their own work before submission.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Teacher Evaluation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GradingForm 
                  submissionId={submission.id} 
                  initialScore={submission.teacherScore} 
                  initialFeedback={submission.teacherFeedback} 
                />
              </CardContent>
            </Card>

            {submission.peerReviews && submission.peerReviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Peer Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {submission.peerReviews.map((review: any) => (
                    <div key={review.id} className="p-3 rounded-lg border bg-secondary/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase">{review.reviewer.name}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-black">{review.score}%</span>
                        </div>
                      </div>
                      <p className="text-sm italic">&quot;{review.feedback}&quot;</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
