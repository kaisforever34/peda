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
import { Plus, BookOpen } from "lucide-react"
import { createCourse } from "@/app/actions/course"
import { ALGERIAN_SUBJECTS, ALGERIAN_GRADES } from "@/lib/constants"
import { toast } from "sonner"

const educationLevels = [
  { id: "PRIMARY", label: "Primaire (Primary school)" },
  { id: "MIDDLE", label: "Moyen (Middle school)" },
  { id: "HIGH_SCHOOL", label: "Secondaire (High school)" },
  { id: "UNIVERSITY", label: "Supérieur (University)" },
]

export function CreateCourseDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<keyof typeof ALGERIAN_SUBJECTS | "">("")

  const grades = selectedLevel ? ALGERIAN_GRADES[selectedLevel] : []
  const subjects = selectedLevel ? ALGERIAN_SUBJECTS[selectedLevel] : []

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    try {
      const result = await createCourse(formData)
      if (result.success) {
        toast.success("Course created successfully!")
        setOpen(false)
        setSelectedLevel("")
      } else {
        toast.error(result.error || "Failed to create course")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
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
          Create Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Create New Course
            </DialogTitle>
            <DialogDescription>
              Define the curriculum and target grade following the official Algerian system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="level">Education Level</Label>
                <select
                  id="level"
                  name="level"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value as any)}
                >
                  <option value="" disabled>Select Level</option>
                  {educationLevels.map(l => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="grade">Grade (Année)</Label>
                <select
                  id="grade"
                  name="grade"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                  disabled={!selectedLevel}
                  defaultValue=""
                >
                  <option value="" disabled>Select Grade</option>
                  {grades.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Subject (Matière)</Label>
              <select
                id="subject"
                name="subject"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-arabic"
                required
                disabled={!selectedLevel}
                defaultValue=""
              >
                <option value="" disabled>Select Official Subject...</option>
                {subjects.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Unit 1: Introduction"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What will students learn in this course?"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
