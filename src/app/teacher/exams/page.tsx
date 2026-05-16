import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, Plus, HelpCircle, Users } from "lucide-react"
import { getExams } from "@/app/actions/exam"
import { getCourses } from "@/app/actions/course"
import { CreateExamDialog } from "./create-exam-dialog"
import { ExamActions } from "@/components/teacher/exam-actions"

import { Pagination } from "@/components/ui/pagination"

export default async function TeacherExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const currentPage = Number(page) || 1
  const { exams, pages } = await getExams(currentPage)
  const { courses } = await getCourses()

  return (
    <AppShell role="TEACHER">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Exams</h1>
            <p className="text-muted-foreground">Manage assessments and quizzes</p>
          </div>
          <CreateExamDialog courses={courses} />
        </div>

        {exams.length === 0 ? (
          <Card className="p-12 flex flex-col items-center justify-center text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No exams yet</h3>
            <p className="text-muted-foreground mb-6">Create your first exam to evaluate student performance.</p>
            <CreateExamDialog courses={courses} />
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4">
              {exams.map((exam) => (
                <Card key={exam.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>{exam.title}</CardTitle>
                      <CardDescription>{exam.course?.title} • {exam.status}</CardDescription>
                    </div>
                    <ExamActions examId={exam.id} />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <HelpCircle className="h-4 w-4" />
                        {exam._count?.questions || 0} questions
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {exam._count?.submissions || 0} submissions
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Pagination 
              totalPages={pages} 
              currentPage={currentPage} 
              baseUrl="/teacher/exams" 
            />
          </div>
        )}
      </div>
    </AppShell>
  )
}
