"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { Mic, Brain } from "lucide-react"

export default function TeacherAiReviewsPage() {
  const { t } = useLanguage()

  return (
    <AppShell role="TEACHER">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("ai_reviews")}</h1>
          <p className="text-muted-foreground">Monitor AI-driven speech evaluations and feedback</p>
        </div>

        <div className="grid gap-6">
          <Card className="border-dashed">
            <CardContent className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">No AI reviews pending</h3>
                <p className="text-muted-foreground max-w-sm">
                  Once students complete voice exams, their AI-generated scores and feedback will appear here for your review.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
