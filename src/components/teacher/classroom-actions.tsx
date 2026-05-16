"use client"

import { useTransition, useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, UserPlus, Trash2, Archive } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { archiveClassroom, deleteClassroom } from "@/app/actions/classroom"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"

interface ClassroomActionsProps {
  classroomId: string
}

export function ClassroomActions({ classroomId }: ClassroomActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleAddStudents = () => {
    toast.info("Student enrollment module coming soon! You can use the Join Code for now.")
  }

  const handleArchive = () => {
    startTransition(async () => {
      const result = await archiveClassroom(classroomId)
      if (result.success) {
        toast.success("Classroom archived successfully")
      } else {
        toast.error(result.error || "Failed to archive classroom")
      }
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteClassroom(classroomId)
      if (result.success) {
        toast.success("Classroom deleted successfully")
        setShowDeleteDialog(false)
      } else {
        toast.error(result.error || "Failed to delete classroom")
      }
    })
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleAddStudents} 
          title="Enroll Students"
          disabled={isPending}
        >
          <UserPlus className="h-4 w-4" />
        </Button>
        <Link href={`/teacher/classes/${classroomId}`}>
          <Button variant="outline" size="icon" title="Edit Class" disabled={isPending}>
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleArchive} 
          title="Archive Class"
          disabled={isPending}
        >
          <Archive className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="text-destructive hover:bg-destructive/10"
          onClick={() => setShowDeleteDialog(true)} 
          title="Delete Class"
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        loading={isPending}
        title="Delete Classroom?"
        description="This will permanently delete the class and all student enrollments. This action cannot be undone."
      />
    </>
  )
}
