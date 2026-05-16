import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, Calendar, Users } from "lucide-react"
import { getAssignments } from "@/app/actions/assignment"
import { getCourses } from "@/app/actions/course"
import { CreateAssignmentDialog } from "./create-assignment-dialog"
import { AssignmentActions } from "@/components/teacher/assignment-actions"

export default async function TeacherAssignmentsPage() {
  const assignments = await getAssignments()
  const { courses } = await getCourses()

  return (
    <AppShell role="TEACHER">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Assignments</h1>
            <p className="text-muted-foreground">Manage tasks and student submissions</p>
          </div>
          <CreateAssignmentDialog courses={courses} />
        </div>

        {assignments.length === 0 ? (
          <Card className="p-12 flex flex-col items-center justify-center text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No assignments yet</h3>
            <p className="text-muted-foreground mb-6">Create your first assignment to start tracking student progress.</p>
            <CreateAssignmentDialog courses={courses} />
          </Card>
        ) : (
          <div className="grid gap-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>{assignment.title}</CardTitle>
                    <CardDescription>{assignment.course?.title}</CardDescription>
                  </div>
                  <AssignmentActions assignmentId={assignment.id} />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {assignment._count?.submissions || 0} submissions
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Created {new Date(assignment.createdAt).toLocaleDateString()}
                    </div>
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
