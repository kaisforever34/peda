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
import { Plus, Users } from "lucide-react"
import { createClassroom } from "@/app/actions/classroom"
import { ALGERIAN_GRADES } from "@/lib/constants"
import { toast } from "sonner"

const educationLevels = [
  { id: "PRIMARY", label: "Primaire (School)" },
  { id: "MIDDLE", label: "Moyen (Middle)" },
  { id: "HIGH_SCHOOL", label: "Secondaire (High)" },
  { id: "UNIVERSITY", label: "Supérieur (University)" },
]

export function CreateClassroomDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<keyof typeof ALGERIAN_GRADES | "">("")

  const grades = selectedLevel ? ALGERIAN_GRADES[selectedLevel] : []

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    try {
      const result = await createClassroom(formData)
      if (result.success) {
        toast.success("Classroom created successfully!")
        setOpen(false)
        setSelectedLevel("")
      } else {
        toast.error(result.error || "Failed to create classroom")
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
          Create Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              New Classroom
            </DialogTitle>
            <DialogDescription>
              Create a virtual classroom for a specific group of students.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Class Name</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Class 3AS Math 1"
                required
              />
            </div>
            
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
              <Label htmlFor="branch">Branch / Specialty (Optional)</Label>
              <Input
                id="branch"
                name="branch"
                placeholder="e.g. Sciences Expérimentales"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
