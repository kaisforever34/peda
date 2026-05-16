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
import { Plus, Users, Search } from "lucide-react"
import { joinClassroom } from "@/app/actions/enrollment"

interface Classroom {
  id: string
  title: string
  level?: string | null
  grade?: string | null
  teacher: { name: string }
  _count: { students: number }
}

interface JoinClassDialogProps {
  availableClassrooms: Classroom[]
}

export function JoinClassDialog({ availableClassrooms }: JoinClassDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedClassId, setSelectedClassId] = useState("")

  async function handleJoin() {
    if (!selectedClassId) return
    setLoading(true)
    try {
      await joinClassroom(selectedClassId)
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
          Join a Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enroll in a Classroom</DialogTitle>
          <DialogDescription>
            Select a class from the list to join and access its courses.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {availableClassrooms.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No classes available yet.</p>
            ) : (
              availableClassrooms.map((classroom) => (
                <div
                  key={classroom.id}
                  onClick={() => setSelectedClassId(classroom.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedClassId === classroom.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <div>
                    <h4 className="font-medium">{classroom.title}</h4>
                    <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                      <span>{classroom.level?.replace('_', ' ')} {classroom.grade}</span>
                      <span>•</span>
                      <span>By {classroom.teacher.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {classroom._count.students}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleJoin}
            disabled={loading || !selectedClassId}
            className="w-full"
          >
            {loading ? "Joining..." : "Join Selected Class"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
