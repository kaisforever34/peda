"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, FileText, ClipboardList, BarChart3, Plus } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { TeacherPerformanceChart } from "@/components/charts/teacher-performance-chart"
import { AIAssistButton } from "@/components/ai/ai-assist-button"

import { ClassroomWithCount, Course, Assignment, Exam, Announcement } from "@/types"

interface TeacherDashboardClientProps {
  initCourses: Course[]
  initClassrooms: ClassroomWithCount[]
  initAssignments: Assignment[]
  initExams: Exam[]
  performanceData: { date: string; averageScore: number }[]
  announcements: Announcement[]
}

export default function TeacherDashboardClient({ 
  initCourses, 
  initClassrooms, 
  initAssignments, 
  initExams,
  performanceData,
  announcements
}: TeacherDashboardClientProps) {
  const { t } = useLanguage()

  const classrooms = initClassrooms || []
  const courses = initCourses || []
  const assignments = initAssignments || []
  const exams = initExams || []

  const totalStudents = classrooms.reduce((acc, c) => acc + (c._count?.students || 0), 0)

  return (
    <AppShell role="TEACHER">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("teacher_view")}</h1>
            <p className="text-muted-foreground">{t("manage_classes")}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/teacher/courses">
              <Button size="sm" variant="outline" className="rounded-full shadow-sm">
                <Plus className="h-4 w-4 mr-2 text-primary" />
                {t("new_course")}
              </Button>
            </Link>
            <Link href="/teacher/classes">
              <Button size="sm" variant="outline" className="rounded-full shadow-sm">
                <Plus className="h-4 w-4 mr-2 text-primary" />
                {t("new_class")}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:border-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("classes")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classrooms.length}</div>
              <p className="text-xs text-muted-foreground">{totalStudents} {t("students_enrolled")}</p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("courses")}</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">
                {courses.filter((c: Course) => c.status === "PUBLISHED").length} {t("published")}
              </p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("assignments")}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignments.length}</div>
              <p className="text-xs text-muted-foreground">{t("tasks_assigned")}</p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("exams")}</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams.length}</div>
              <p className="text-xs text-muted-foreground">{t("assessments")}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>{t("class_overview")}</CardTitle>
              <CardDescription>{t("active_classes")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {classrooms.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center border border-dashed rounded-xl bg-secondary/10">
                  <p className="text-muted-foreground text-sm">No active classes found.</p>
                  <Link href="/teacher/classes">
                    <Button variant="link" className="text-primary mt-1">{t("create_first_class")}</Button>
                  </Link>
                </div>
              ) : (
                classrooms.slice(0, 3).map((classroom: ClassroomWithCount) => (
                  <div key={classroom.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all">
                    <div className="h-12 w-12 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{classroom.title}</h3>
                      <p className="text-sm text-muted-foreground font-mono">
                        {classroom.grade} • {classroom.branch}
                      </p>
                    </div>
                    <div className="text-right mr-4 hidden sm:block">
                       <p className="text-sm font-bold">{classroom._count?.students || 0}</p>
                       <p className="text-[10px] uppercase text-muted-foreground">Students</p>
                    </div>
                    <Link href={`/teacher/classes/${classroom.id}`}>
                      <Button variant="outline" size="sm" className="rounded-full">{t("manage")}</Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-t from-primary/[0.03] to-transparent">
            <CardHeader>
              <CardTitle>{t("quick_actions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/teacher/courses">
                <Button variant="outline" className="w-full justify-start rounded-xl">
                   <BookOpen className="h-4 w-4 mr-3 text-indigo-500" />
                   {t("manage_courses")}
                </Button>
              </Link>
              <Link href="/teacher/assignments">
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <FileText className="h-4 w-4 mr-3 text-cyan-500" />
                  {t("manage_assignments")}
                </Button>
              </Link>
              <Link href="/teacher/exams">
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <ClipboardList className="h-4 w-4 mr-3 text-purple-500" />
                  {t("manage_exams")}
                </Button>
              </Link>
              <Link href="/teacher/reports">
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <BarChart3 className="h-4 w-4 mr-3 text-green-500" />
                  {t("view_reports")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                {t("analytics_title")}
              </CardTitle>
              <div className="flex items-center justify-between mt-1">
                <CardDescription>Average AI graded scores over the last 7 days</CardDescription>
                <AIAssistButton mode="grading" context="Class performance analytics for the last 7 days" />
              </div>
            </CardHeader>
            <CardContent>
              <TeacherPerformanceChart data={performanceData || []} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("recent_announcements")}</CardTitle>
                <CardDescription>{t("broadcast_desc")}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <AIAssistButton mode="admin" context="Drafting monthly student progress report" />
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" /> {t("new")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground bg-secondary/10 rounded-xl border border-dashed">
                  {t("no_announcements")}
                </div>
              ) : (
                <div className="space-y-3">
                  {announcements.map(ann => (
                    <div key={ann.id} className="p-3 rounded-lg border bg-card text-sm">
                      <h4 className="font-bold">{ann.title}</h4>
                      <p className="text-muted-foreground mt-1 truncate">{ann.content}</p>
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
