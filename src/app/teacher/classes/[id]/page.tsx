import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Users, UserPlus, BookOpen, Settings } from "lucide-react"
import Link from "next/link"
import { getClassroom } from "@/app/actions/classroom"
import { notFound } from "next/navigation"

export default async function ClassroomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const classroom = await getClassroom(id)

  if (!classroom) {
    notFound()
  }

  return (
    <AppShell role="TEACHER">
      <div className="space-y-6">
        <Link href="/teacher/classes">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Classes
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{classroom.title}</h1>
            <p className="text-muted-foreground">{classroom.description || "No description provided."}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Students
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Students</CardTitle>
                    <CardDescription>
                      {classroom._count.students} students enrolled in this class.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Join Code:</span>
                    <code className="px-2 py-1 bg-primary/10 text-primary rounded font-black text-sm">
                      {classroom.joinCode}
                    </code>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {classroom.students.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No students enrolled yet.</p>
                    <p className="text-sm">Share the join code with your students to get started.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {classroom.students.map((cs) => (
                      <div key={cs.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground">
                            {cs.student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{cs.student.name}</p>
                            <p className="text-xs text-muted-foreground">{cs.student.email}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Class Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-medium">{classroom.level?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Grade</span>
                  <span className="font-medium">{classroom.grade}</span>
                </div>
                {classroom.branch && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Branch</span>
                    <span className="font-medium">{classroom.branch}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    classroom.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {classroom.status}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Assigned Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classroom.courses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No courses assigned to this class yet.</p>
                ) : (
                  <div className="space-y-2">
                    {classroom.courses.map(course => (
                      <div key={course.id} className="p-2 border rounded-md text-sm hover:bg-accent transition-colors">
                        {course.title}
                      </div>
                    ))}
                  </div>
                )}
                <Button variant="outline" className="w-full mt-4" size="sm">Assign Course</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
