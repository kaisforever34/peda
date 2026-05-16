"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye } from "lucide-react"

export function SubmissionReviewButton({ submissionId }: { submissionId: string }) {
  return (
    <Link href={`/teacher/submissions/${submissionId}`}>
      <Button variant="outline" size="sm" className="gap-2">
        <Eye className="h-4 w-4" />
        Review Work
      </Button>
    </Link>
  )
}
