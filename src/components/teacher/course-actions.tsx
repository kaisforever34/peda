"use client"

import { useTransition, useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Globe } from "lucide-react"
import { publishCourse, deleteCourse } from "@/app/actions/course"
import { toast } from "sonner"
import Link from "next/link"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"

interface CourseActionsProps {
  courseId: string
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
}

export function CourseActions({ courseId, status }: CourseActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handlePublish = () => {
    startTransition(async () => {
      const result = await publishCourse(courseId)
      if (result.success) {
        toast.success("Course published successfully!")
      } else {
        toast.error(result.error || "Failed to publish course")
      }
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCourse(courseId)
      if (result.success) {
        toast.success("Course deleted successfully!")
        setShowDeleteDialog(false)
      } else {
        toast.error(result.error || "Failed to delete course")
      }
    })
  }

  return (
    <>
      <div className="flex items-center gap-2 w-full">
        {status === "DRAFT" ? (
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 gap-2" 
            onClick={handlePublish}
            disabled={isPending}
          >
            <Globe className="h-4 w-4" />
            Publish
          </Button>
        ) : (
          <Link href={`/teacher/courses/${courseId}`} className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Edit className="h-4 w-4" />
              Manage
            </Button>
          </Link>
        )}
        <Link href={`/teacher/courses/${courseId}`}>
          <Button variant="outline" size="icon" disabled={isPending}>
            <Edit className="h-4 w-4" />
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
        title="Delete Course?"
        description="This will permanently delete the course and all its modules, lessons, and student progress."
      />
    </>
  )
}
