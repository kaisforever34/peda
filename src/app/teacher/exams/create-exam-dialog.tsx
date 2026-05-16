"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, ClipboardList, Mic, FileText } from "lucide-react"
import { createExam } from "@/app/actions/exam"

export function CreateExamDialog({ courses }: { courses: any[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [examType, setExamType] = useState("WRITTEN")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    try {
      await createExam(formData)
      setOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Exam
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>New Assessment</DialogTitle>
            <DialogDescription>
              Assign a new test or voice assessment to your students.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Assessment Type</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button"
                  variant={examType === "WRITTEN" ? "default" : "outline"}
                  className="flex flex-col h-20 gap-1"
                  onClick={() => setExamType("WRITTEN")}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">Written Quiz</span>
                </Button>
                <Button 
                  type="button"
                  variant={examType === "VOICE" ? "default" : "outline"}
                  className="flex flex-col h-20 gap-1 border-primary/20"
                  onClick={() => setExamType("VOICE")}
                >
                  <Mic className="h-5 w-5 text-primary" />
                  <span className="text-xs">AI Voice Exam</span>
                </Button>
              </div>
              <input type="hidden" name="type" value={examType} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="courseId">Course</Label>
              <select
                id="courseId"
                name="courseId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
                defaultValue=""
              >
                <option value="" disabled>Select Course</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Exam Title</Label>
              <Input
                id="title"
                name="title"
                placeholder={examType === "VOICE" ? "e.g. Oral Presentation Exam" : "e.g. Middle Term Quiz"}
                required
              />
            </div>

            {examType === "VOICE" ? (
              <div className="grid gap-2">
                <Label htmlFor="voiceSubject">Subject to Present / Speak</Label>
                <Textarea
                  id="voiceSubject"
                  name="voiceSubject"
                  placeholder="The text or topic the student must record..."
                  required
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Instructions for the quiz..."
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="timeLimit">Time Limit (mins)</Label>
                <Input id="timeLimit" name="timeLimit" type="number" defaultValue="30" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="passingScore">Passing Score (%)</Label>
                <Input id="passingScore" name="passingScore" type="number" defaultValue="60" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Assessment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
