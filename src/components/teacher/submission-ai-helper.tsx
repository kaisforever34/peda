"use client"

import { AIAssistButton } from "@/components/ai/ai-assist-button"

interface SubmissionAIHelperProps {
  studentName: string
  assignmentTitle: string
  score: number | null
}

export function SubmissionAIHelper({ studentName, assignmentTitle, score }: SubmissionAIHelperProps) {
  return (
    <AIAssistButton 
      mode="grading" 
      context={`Grading for ${studentName} on ${assignmentTitle}. AI Score: ${score || 'Pending'}`} 
    />
  )
}
