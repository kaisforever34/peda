"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { TrendingUp } from "lucide-react"
import { PerformanceChart } from "@/components/charts/performance-chart"

export default function TeacherReportsPage() {
  const { t } = useLanguage()

  return (
    <AppShell role="TEACHER">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("reports")}</h1>
          <p className="text-muted-foreground">Comprehensive analytics and performance reports</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Global Performance Trends</CardTitle>
                  <CardDescription>Average scores across all active classes compared to last month</CardDescription>
                </div>
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                  <TrendingUp className="h-3 w-3" />
                  +12.5% Improvement
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <PerformanceChart data={[]} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Class Distribution</CardTitle>
              <CardDescription>Average scores per classroom</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center border-t">
              <p className="text-muted-foreground italic">Detailed breakdown will be available as students complete more assessments.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Rate</CardTitle>
              <CardDescription>Student activity over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center border-t">
              <p className="text-muted-foreground italic">Engagement metrics are being calculated based on login frequency.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
