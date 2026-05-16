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
import { Plus } from "lucide-react"
import { createAssignment } from "@/app/actions/assignment"

interface CreateAssignmentDialogProps {
  courses: { id: string; title: string }[]
}

export function CreateAssignmentDialog({ courses }: CreateAssignmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    try {
      await createAssignment(formData)
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
        <Button disabled={courses.length === 0}>
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Create Assignment</DialogTitle>
            <DialogDescription>
              Assign new tasks to your students.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="courseId">Course</Label>
              <select
                id="courseId"
                name="courseId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
                defaultValue=""
              >
                <option value="" disabled>Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Weekly Reflection"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Instructions</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What should the students do?"
                required
              />
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-lg bg-secondary/20">
              <input 
                type="checkbox" 
                id="peerReviewEnabled" 
                name="peerReviewEnabled" 
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="peerReviewEnabled" className="text-sm font-bold">Enable Peer Review</Label>
                <p className="text-xs text-muted-foreground">Students will grade each others work.</p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="peerReviewsRequired">Reviews Required per Student</Label>
              <Input
                id="peerReviewsRequired"
                name="peerReviewsRequired"
                type="number"
                min="1"
                max="5"
                defaultValue="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Assignment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
