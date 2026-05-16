import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SafeDate } from "@/components/ui/safe-date"
import { ClipboardList, FileText, Mic, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  AI_REVIEWED: "bg-blue-100 text-blue-800",
  TEACHER_REVIEWED: "bg-green-100 text-green-800",
  GRADED: "bg-green-100 text-green-800",
}

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  AI_REVIEWED: "AI Reviewed",
  TEACHER_REVIEWED: "Teacher Reviewed",
  GRADED: "Graded",
}

export default async function StudentResultsPage() {
  const { userId } = await auth()
  if (!userId) {
    return (
      <AppShell role="STUDENT">
        <p className="text-muted-foreground">Please log in to view results.</p>
      </AppShell>
    )
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) notFound()

  const submissions = await prisma.submission.findMany({
    where: { studentId: user.id },
    include: {
      exam: { select: { id: true, title: true, type: true, courseId: true } },
      assignment: { select: { id: true, title: true, courseId: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const finalScore = (sub: typeof submissions[0]) =>
    sub.teacherScore ?? sub.aiScore

  const finalFeedback = (sub: typeof submissions[0]) =>
    sub.teacherFeedback || sub.aiFeedback

  return (
    <AppShell role="STUDENT">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Results</h1>
          <p className="text-muted-foreground">Review your performance and grades</p>
        </div>

        {submissions.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ClipboardList className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">No results yet</h3>
                <p className="text-muted-foreground max-w-sm">
                  Complete your exams and assignments to see your grades and AI feedback here.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => {
              const score = finalScore(sub)
              const feedback = finalFeedback(sub)
              const title = sub.exam?.title || sub.assignment?.title || "Submission"
              const isVoice = sub.exam?.type === "VOICE"

              return (
                <Card key={sub.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isVoice ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
                        {isVoice ? <Mic className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div>
                        <CardTitle className="text-base">{title}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          <SafeDate date={sub.createdAt} />
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[sub.status] || "bg-gray-100 text-gray-800"}`}>
                        {statusLabels[sub.status] || sub.status}
                      </span>
                      {score !== null && score !== undefined && (
                        <span className="text-lg font-bold text-primary">{Math.round(score)}%</span>
                      )}
                    </div>
                  </CardHeader>
                  {feedback && (
                    <CardContent className="pt-2">
                      <p className="text-sm text-muted-foreground">{feedback}</p>
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
