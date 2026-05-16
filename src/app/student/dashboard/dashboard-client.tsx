"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Mic, FileText, ClipboardList, Award, TrendingUp, Bell } from "lucide-react"
import { PerformanceChart } from "@/components/charts/performance-chart"
import { SafeDate } from "@/components/ui/safe-date"
import { useLanguage } from "@/components/language-provider"
import Link from "next/link"

import { EnrollmentWithCourse, Assignment, Exam, AnnouncementWithTeacher, PerformanceProjection } from "@/types"
import { StreakCounter } from "@/components/student/streak-counter"
import { BadgeCard } from "@/components/student/badge-card"
import { JoinClassDialog } from "@/components/student/join-class-dialog"
import { BadgeManager } from "@/components/student/badge-manager"
import { PeerReviewWidget } from "@/components/student/peer-review-widget"
import { Progress } from "@/components/ui/progress"

interface StudentDashboardClientProps {
  userName: string
  enrollments: EnrollmentWithCourse[]
  assignments: Assignment[]
  exams: Exam[]
  points: number
  streak: number
  badges: any[]
  announcements: AnnouncementWithTeacher[]
  leaderboard: { id: string; name: string; points: number }[]
  performanceData: { name: string; score: number; average: number }[]
  performanceProjection?: PerformanceProjection
  peerReviewTask?: any
}

export default function StudentDashboardClient({ 
  userName,
  enrollments, 
  assignments, 
  exams,
  points,
  streak,
  badges,
  announcements,
  leaderboard,
  performanceData,
  performanceProjection,
  peerReviewTask
}: StudentDashboardClientProps) {
  const { t } = useLanguage()
  
  const inProgress = enrollments.filter(e => e.progress < 100 && e.progress > 0)
  const completed = enrollments.filter(e => e.progress === 100)

  const pendingAssignments = assignments.filter(a => !a.dueDate || new Date(a.dueDate) > new Date())
  const upcomingExams = exams.filter(e => e.status === "PUBLISHED") // Simplified logic for now

  return (
    <AppShell role="STUDENT">
      <BadgeManager />
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight">{t("welcome")}, {userName?.split(' ')[0] || 'Scholar'}!</h1>
              <div className="flex items-center gap-2">
                <StreakCounter streak={streak} />
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 text-yellow-600 rounded-full font-black text-sm border border-yellow-500/20 shadow-sm">
                  <Award className="h-4 w-4" />
                  <span>{points} XP</span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground font-medium mt-1">{t("continue_learning")}</p>
          </div>
          <div className="flex gap-2">
             <JoinClassDialog />
             <Link href="/student/voice-coach">
               <Button className="gap-2 shadow-lg hover:shadow-primary/25 transition-all">
                 <Mic className="h-4 w-4" />
                 {t("practice_speaking")}
               </Button>
             </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:border-primary hover:-translate-y-1 transition-all cursor-default group relative overflow-hidden bg-gradient-to-br from-card to-card">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("my_courses")}</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                <BookOpen className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrollments.length}</div>
              <p className="text-xs text-muted-foreground">{inProgress.length} in progress</p>
            </CardContent>
          </Card>
          
          <Card className="hover:border-blue-500 hover:-translate-y-1 transition-all cursor-default group relative overflow-hidden bg-gradient-to-br from-card to-card">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("assignments")}</CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                <FileText className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignments.length}</div>
              <p className="text-xs text-muted-foreground font-medium text-blue-500">{pendingAssignments.length} pending</p>
            </CardContent>
          </Card>
          
          <Card className="hover:border-purple-500 hover:-translate-y-1 transition-all cursor-default group relative overflow-hidden bg-gradient-to-br from-card to-card">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("exams")}</CardTitle>
              <div className="p-2 bg-purple-500/10 rounded-full group-hover:bg-purple-500/20 transition-colors">
                <ClipboardList className="h-4 w-4 text-purple-500 group-hover:scale-110 transition-transform" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams.length}</div>
              <p className="text-xs text-muted-foreground font-medium text-purple-500">{upcomingExams.length} upcoming</p>
            </CardContent>
          </Card>
          
          <Card className="hover:border-green-500 hover:-translate-y-1 transition-all cursor-default group relative overflow-hidden bg-gradient-to-br from-card to-card">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("certificates")}</CardTitle>
              <div className="p-2 bg-green-500/10 rounded-full group-hover:bg-green-500/20 transition-colors">
                <Award className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completed.length}</div>
              <p className="text-xs font-medium text-green-600">Keep learning!</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1 lg:col-span-2 border-primary/20 shadow-sm relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <CardHeader>
              <CardTitle>{t("continue_learning_title")}</CardTitle>
              <CardDescription>{t("pick_up_where_left_off")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrollments.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground bg-secondary/20 rounded-xl border border-dashed border-border">
                  <BookOpen className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="font-medium">No classes yet.</p>
                  <p className="text-sm mt-1">Join a class to get started.</p>
                  <Link href="/student/courses">
                    <Button variant="outline" className="mt-4">Find a Class</Button>
                  </Link>
                </div>
              ) : (
                enrollments.slice(0, 3).map((enr: EnrollmentWithCourse) => (
                  <div key={enr.id} className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all cursor-pointer hover:shadow-md">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{enr.course.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                           <div className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary" style={{ width: `${enr.progress}%` }} />
                        </div>
                        <span className="text-xs font-black text-primary">{enr.progress}%</span>
                      </div>
                    </div>
                    <Link href={`/student/courses/${enr.courseId}`}>
                      <Button variant="default" size="sm" className="rounded-full shadow-sm group-hover:shadow-md transition-all">Continue</Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-transparent flex flex-col">
            <CardHeader>
              <CardTitle className="text-primary flex items-center justify-between">
                Achievements
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{badges.filter(b => b.awardedAt).length}/{badges.length} Unlocked</span>
              </CardTitle>
              <CardDescription>Your earned badges</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto max-h-[350px] scrollbar-hide pb-6">
              {badges.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-xs text-muted-foreground italic">
                  Complete lessons to earn badges!
                </div>
              ) : (
                badges.map((badge) => (
                  <BadgeCard 
                    key={badge.id} 
                    name={badge.name} 
                    description={badge.description} 
                    iconName={badge.icon} 
                    color={badge.color}
                    awardedAt={badge.awardedAt}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {peerReviewTask && (
          <div className="max-w-md">
            <PeerReviewWidget task={peerReviewTask} />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t("progress_overview")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{t("overall_completion")}</span>
                    <span className="font-medium">
                      {enrollments.length > 0 ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length) : 0}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000" 
                      style={{ width: `${enrollments.length > 0 ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length) : 0}%` }}
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                   <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Performance Trend</h5>
                   <PerformanceChart data={performanceData} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/[0.02]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Predictive Analytics
              </CardTitle>
              <CardDescription>Multi-layered performance projection</CardDescription>
            </CardHeader>
            <CardContent>
              {performanceProjection ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-primary/10 shadow-sm">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Projected Score</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-primary">{performanceProjection.projectedScore}%</span>
                        <span className={`text-xs font-bold ${
                          performanceProjection.trend === "UP" ? "text-emerald-500" : 
                          performanceProjection.trend === "DOWN" ? "text-red-500" : "text-muted-foreground"
                        }`}>
                          {performanceProjection.trend === "UP" ? "↑ Improving" : 
                           performanceProjection.trend === "DOWN" ? "↓ Declining" : "→ Stable"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Confidence</p>
                      <p className="font-bold text-foreground">{performanceProjection.confidence}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Score Breakdown</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Teacher", value: performanceProjection.breakdown.teacher, color: "bg-blue-500" },
                        { label: "AI Scored", value: performanceProjection.breakdown.ai, color: "bg-purple-500" },
                        { label: "Peer Review", value: performanceProjection.breakdown.peer, color: "bg-orange-500" },
                        { label: "Self Eval", value: performanceProjection.breakdown.self, color: "bg-emerald-500" },
                      ].map((item) => (
                        <div key={item.label} className="p-2 rounded-lg bg-background/50 border border-border">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-medium text-muted-foreground">{item.label}</span>
                            <span className="text-[10px] font-bold">{item.value}%</span>
                          </div>
                          <Progress value={item.value} className="h-1" indicatorClassName={item.color} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-xs text-foreground italic">
                      "Based on your {performanceProjection.trend === "UP" ? "upward" : "recent"} trend, 
                      we project an improvement in your next exam if you maintain your current peer engagement."
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  Submit assignments and exams to unlock your performance projection.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Class Leaderboard
              </CardTitle>
              <CardDescription>Top performers in your cohort</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((student, index) => (
                  <div key={student.id} className={`flex items-center justify-between p-3 rounded-xl border ${index === 0 ? "bg-yellow-500/10 border-yellow-500/30" : index === 1 ? "bg-muted/50 border-border" : index === 2 ? "bg-orange-500/10 border-orange-500/20" : "bg-card hover:bg-accent/30"} transition-colors`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? "bg-yellow-500 text-white shadow-lg" : index === 1 ? "bg-muted text-foreground" : index === 2 ? "bg-orange-500 text-white" : "bg-secondary text-muted-foreground"}`}>
                        {index + 1}
                      </div>
                      <span className={`font-medium ${student.name.includes("(You)") ? "text-primary font-bold" : ""}`}>{student.name}</span>
                    </div>
                    <span className="font-bold font-mono text-sm">{student.points} XP</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Latest Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground bg-secondary/10 rounded-xl border border-dashed">
                  No announcements yet. Check back later.
                </div>
              ) : (
                <div className="space-y-3">
                  {announcements.map(ann => (
                    <div key={ann.id} className="p-4 rounded-xl border bg-card hover:bg-accent/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-sm">{ann.title}</h4>
                        <span className="text-[10px] text-muted-foreground"><SafeDate date={ann.createdAt} /></span>
                      </div>
                      <p className="text-sm text-foreground/80">{ann.content}</p>
                      <p className="text-[10px] font-bold text-primary mt-3 uppercase tracking-wider">— {ann.teacher?.name || "Teacher"}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
