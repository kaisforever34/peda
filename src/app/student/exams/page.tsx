import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, Clock, CheckCircle2, Mic, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getStudentExams } from "@/app/actions/exam-student"

export default async function StudentExamsPage() {
  const exams = await getStudentExams()

  return (
    <AppShell role="STUDENT">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Assessments</h1>
          <p className="text-muted-foreground">Complete your quizzes and voice evaluations</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {exams.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No assessments assigned yet.
            </div>
          ) : (
            exams.map((exam) => (
              <Card key={exam.id} className="overflow-hidden flex flex-col group hover:shadow-lg transition-shadow">
                <div className={`h-2 ${exam.type === 'VOICE' ? 'bg-primary' : 'bg-blue-500'}`} />
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                      exam.type === 'VOICE' ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {exam.type}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {exam.timeLimit}m
                    </div>
                  </div>
                  <CardTitle className="line-clamp-1">{exam.title}</CardTitle>
                  <CardDescription>{exam.course.title}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="p-3 bg-secondary/50 rounded-lg text-sm italic line-clamp-2">
                    {exam.type === 'VOICE' ? exam.voiceSubject : exam.description}
                  </div>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                    {exam.type === 'VOICE' ? (
                      <Link href={`/student/voice-coach?examId=${exam.id}&subject=${encodeURIComponent(exam.voiceSubject || '')}`}>
                        <Button className="w-full gap-2 rounded-xl h-11">
                          <Mic className="h-4 w-4" />
                          Start Voice Test
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/student/exams/${exam.id}`}>
                        <Button variant="outline" className="w-full gap-2 rounded-xl h-11 border-blue-200 hover:bg-blue-50 text-blue-700">
                          <FileText className="h-4 w-4" />
                          Take Quiz
                        </Button>
                      </Link>
                    )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppShell>
  )
}
