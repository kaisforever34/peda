"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ChevronLeft, ChevronRight, CheckCircle, Circle, ClipboardList } from "lucide-react"
import { toast } from "sonner"
import { submitWrittenExam } from "@/app/actions/exam-student"

interface ExamQuestion {
  id: string
  question: string
  type: string
  options: unknown
  points: number
}

interface ExamData {
  id: string
  title: string
  course: { title: string }
  timeLimit: number | null
  questions: ExamQuestion[]
}

export default function ExamPlayerClient({ exam }: { exam: ExamData }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState((exam.timeLimit || 60) * 60)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (submitted) return
    const total = (exam.timeLimit || 60) * 60
    const endTime = Date.now() + total * 1000
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000))
      setTimeLeft(remaining)
      if (remaining <= 0) {
        clearInterval(timer)
        handleSubmitRef.current()
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [submitted, exam.timeLimit])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [exam.questions[currentQuestion].id]: answer }))
  }

  const handleSubmit = useCallback(async () => {
    const result = await submitWrittenExam(exam.id, answers)
    if (result.success) {
      setSubmitted(true)
      toast.success("Exam submitted successfully!")
    } else {
      toast.error(result.error || "Failed to submit exam")
    }
  }, [exam.id, answers])

  const handleSubmitRef = useRef(handleSubmit)
  handleSubmitRef.current = handleSubmit

  const question = exam.questions[currentQuestion]
  const answeredQuestions = new Set(Object.keys(answers)).size

  if (exam.questions.length === 0) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-12 text-center text-muted-foreground border-dashed">
            <ClipboardList className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="font-medium">Exam not ready.</p>
            <p className="text-sm mt-1">Check back later when questions are added.</p>
          </Card>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            <p className="text-muted-foreground">{exam.course.title}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 300 ? "bg-destructive/10 text-destructive" : "bg-secondary"}`}>
              <Clock className="h-4 w-4" />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
            <Button onClick={handleSubmit} disabled={submitted}>
              Submit Exam
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Question {currentQuestion + 1} of {exam.questions.length}</CardTitle>
                  <span className="text-sm text-muted-foreground">{question.points} points</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg font-medium">{question.question}</p>

                {question.type === "MULTIPLE_CHOICE" && (() => {
                  const options = (Array.isArray(question.options) ? question.options : []) as string[]
                  return (
                    <div className="space-y-2">
                      {options.map((option, index) => (
                        <Button
                          key={index}
                          variant={answers[question.id] === option ? "default" : "outline"}
                          className="w-full justify-start text-left h-auto py-3"
                          onClick={() => handleAnswer(option)}
                        >
                          {answers[question.id] === option ? (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          ) : (
                            <Circle className="h-4 w-4 mr-2" />
                          )}
                          {option}
                        </Button>
                      ))}
                    </div>
                  )
                })()}

                {question.type === "TEXT" && (
                  <textarea
                    className="w-full min-h-[150px] p-4 rounded-lg border border-border bg-background"
                    placeholder="Write your answer here..."
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswer(e.target.value)}
                  />
                )}
              </CardContent>
            </Card>

            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(q => q - 1)}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={() => setCurrentQuestion(q => q + 1)}
                disabled={currentQuestion === exam.questions.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {exam.questions.map((q, index) => (
                    <Button
                      key={q.id}
                      variant={index === currentQuestion ? "default" : answers[q.id] ? "outline" : "ghost"}
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={() => setCurrentQuestion(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Answered</span>
                    <span className="font-medium">{answeredQuestions}/{exam.questions.length}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(answeredQuestions / exam.questions.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Time spent: {formatTime((exam.timeLimit || 60) * 60 - timeLeft)}</p>
                  <p>Time remaining: {formatTime(timeLeft)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
