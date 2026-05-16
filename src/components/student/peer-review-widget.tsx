"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Star, Send, X } from "lucide-react"
import { submitPeerReview } from "@/app/actions/peer-review"
import { toast } from "sonner"

interface PeerReviewWidgetProps {
  task: {
    assignmentTitle: string
    submission: {
      id: string
      answers: any
      student: { name: string }
    }
  }
}

export function PeerReviewWidget({ task }: PeerReviewWidgetProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [score, setScore] = useState(5)
  const [feedback, setFeedback] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    if (feedback.length < 10) {
      toast.error("Please provide more detailed feedback (min 10 characters).")
      return
    }

    startTransition(async () => {
      const result = await submitPeerReview(task.submission.id, score * 20, feedback)
      if (result.success) {
        toast.success("Peer review submitted! +30 XP earned.")
        setIsOpen(false)
      } else {
        toast.error(result.error || "Failed to submit review")
      }
    })
  }

  if (!isOpen) return null

  return (
    <Card className="border-primary/30 bg-primary/5 shadow-lg animate-in slide-in-from-right-4 duration-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold">Peer Review Opportunity</CardTitle>
              <CardDescription className="text-[10px] uppercase font-black tracking-widest text-primary/70">Earn +30 XP</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg bg-background border text-xs">
          <p className="font-bold mb-1">Assignment: {task.assignmentTitle}</p>
          <p className="text-muted-foreground italic">&quot;{typeof task.submission.answers === 'string' ? task.submission.answers.substring(0, 100) : 'View work below'}...&quot;</p>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setScore(s)}
                className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                  score >= s ? "bg-primary text-white shadow-md scale-110" : "bg-background border hover:border-primary/50"
                }`}
              >
                <Star className={`h-4 w-4 ${score >= s ? "fill-current" : ""}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">Feedback for {task.submission.student.name.split(' ')[0]}</label>
          <textarea
            className="w-full p-3 rounded-xl border bg-background text-sm min-h-[80px] focus:ring-1 focus:ring-primary outline-none"
            placeholder="What did they do well? What could be improved?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <Button 
          className="w-full rounded-xl gap-2 font-bold" 
          onClick={handleSubmit}
          disabled={isPending}
        >
          <Send className="h-4 w-4" />
          {isPending ? "Submitting..." : "Submit Review"}
        </Button>
      </CardContent>
    </Card>
  )
}
