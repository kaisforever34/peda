"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { gradeSubmission } from "@/app/actions/grading"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface GradingFormProps {
  submissionId: string
  initialScore?: number | null
  initialFeedback?: string | null
}

export function GradingForm({ 
  submissionId, 
  initialScore, 
  initialFeedback 
}: GradingFormProps) {
  const [score, setScore] = useState(initialScore?.toString() || "")
  const [feedback, setFeedback] = useState(initialFeedback || "")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const scoreNum = parseFloat(score)
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      toast.error("Please enter a valid score between 0 and 100")
      return
    }

    startTransition(async () => {
      const result = await gradeSubmission(submissionId, scoreNum, feedback)
      if (result.success) {
        toast.success("Submission graded successfully")
        router.push("/teacher/submissions")
      } else {
        toast.error(result.error || "Failed to save grade")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Final Score</label>
        <input 
          type="number" 
          className="w-full p-2 rounded-md border bg-background" 
          placeholder="Enter score (0-100)"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          disabled={isPending}
          min="0"
          max="100"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Feedback</label>
        <textarea 
          className="w-full p-2 rounded-md border bg-background min-h-[100px]" 
          placeholder="Provide constructive feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disabled={isPending}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Save Evaluation"}
      </Button>
    </form>
  )
}
