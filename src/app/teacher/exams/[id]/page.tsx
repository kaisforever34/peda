import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Plus, Trash2, HelpCircle } from "lucide-react"
import Link from "next/link"
import { getExamWithQuestions, addExamQuestion, deleteExamQuestion } from "@/app/actions/exam-editor"
import { notFound } from "next/navigation"

export default async function ExamEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const exam = await getExamWithQuestions(id)

  if (!exam) notFound()

  return (
    <AppShell role="TEACHER">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/teacher/exams">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{exam.title}</h1>
            <p className="text-muted-foreground">Manage questions for this exam</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Existing Questions
            </h2>
            {exam.questions.length === 0 ? (
              <Card className="p-12 text-center text-muted-foreground border-dashed">
                No questions added to this exam yet.
              </Card>
            ) : (
              exam.questions.map((q, idx) => (
                <Card key={q.id}>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-md">Question {idx + 1}</CardTitle>
                    <form action={async () => { "use server"; await deleteExamQuestion(q.id) }}>
                      <Button type="submit" variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium mb-2">{q.question}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-muted-foreground">Points: <b className="text-foreground">{q.points}</b></span>
                      <span className="text-muted-foreground">Type: <b className="text-foreground">{q.type}</b></span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Question</CardTitle>
                <CardDescription>Create a new assessment item</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={async (formData) => {
                  "use server"
                  await addExamQuestion(id, formData)
                }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="question">Question Text</Label>
                    <Textarea name="question" placeholder="e.g. What is the derivative of x²?" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="points">Points</Label>
                      <Input name="points" type="number" defaultValue="1" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <select name="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="TEXT">Short Answer</option>
                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                        <option value="ESSAY">Long Essay</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="answer">Correct Answer (Optional)</Label>
                    <Input name="answer" placeholder="Expected answer for auto-grading" />
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
