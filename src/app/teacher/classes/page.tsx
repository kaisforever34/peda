import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Plus, Eye, Edit, Trash2, UserPlus } from "lucide-react"
import { getClassrooms } from "@/app/actions/classroom"
import { CreateClassroomDialog } from "./create-classroom-dialog"
import { ClassroomActions } from "@/components/teacher/classroom-actions"
import Link from "next/link"

export default async function TeacherClassesPage() {
  const classrooms = await getClassrooms()

  return (
    <AppShell role="TEACHER">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Classes</h1>
            <p className="text-muted-foreground">Manage your student groups and enrollments</p>
          </div>
          <CreateClassroomDialog />
        </div>

        {classrooms.length === 0 ? (
          <Card className="p-12 flex flex-col items-center justify-center text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No classes yet</h3>
            <p className="text-muted-foreground mb-6">Create a class to start adding students.</p>
            <CreateClassroomDialog />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {classrooms.map((classroom) => (
              <Card key={classroom.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{classroom.title}</CardTitle>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase font-bold">
                          {classroom.level?.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-bold">
                          {classroom.grade}
                        </span>
                        {classroom.branch && (
                          <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded italic">
                            {classroom.branch}
                          </span>
                        )}
                      </div>
                    </div>
                    <ClassroomActions classroomId={classroom.id} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {classroom._count?.students || 0} students enrolled
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Join Code:</span>
                        <code className="px-2 py-0.5 bg-primary/5 text-primary border border-primary/20 rounded font-black text-xs select-all">
                          {classroom.joinCode}
                        </code>
                      </div>
                    </div>
                    <Link href={`/teacher/classes/${classroom.id}`}>
                      <Button variant="ghost" size="sm">
                        View Students
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
