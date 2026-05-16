"use client"

import { useTransition, useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { deleteExam } from "@/app/actions/exam"
import { toast } from "sonner"
import Link from "next/link"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"

interface ExamActionsProps {
  examId: string
}

export function ExamActions({ examId }: ExamActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteExam(examId)
      if (result.success) {
        toast.success("Exam deleted")
        setShowDeleteDialog(false)
      } else {
        toast.error(result.error || "Failed to delete exam")
      }
    })
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Link href={`/teacher/exams/${examId}`}>
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Edit Questions</span>
          </Button>
        </Link>
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
        title="Delete Exam?"
        description="This will permanently delete the exam, all its questions, and student results."
      />
    </>
  )
}
