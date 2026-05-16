"use client"

import { useTransition, useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import { deleteAssignment } from "@/app/actions/assignment"
import { toast } from "sonner"
import Link from "next/link"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"

interface AssignmentActionsProps {
  assignmentId: string
}

export function AssignmentActions({ assignmentId }: AssignmentActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAssignment(assignmentId)
      if (result.success) {
        toast.success("Assignment deleted")
        setShowDeleteDialog(false)
      } else {
        toast.error(result.error || "Failed to delete assignment")
      }
    })
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Link href="/teacher/submissions">
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">View Submissions</span>
          </Button>
        </Link>
        <Button variant="outline" size="icon" disabled={isPending}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="text-destructive hover:bg-destructive/10" 
          onClick={() => setShowDeleteDialog(true)}
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
        title="Delete Assignment?"
        description="This will permanently delete the assignment and all student submissions."
      />
    </>
  )
}
