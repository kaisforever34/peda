import { getTeacherDashboardData } from "@/app/actions/dashboard"
import TeacherDashboardClient from "./dashboard-client"

export default async function TeacherDashboard() {
  const data = await getTeacherDashboardData()

  return (
    <TeacherDashboardClient 
      initCourses={data.courses} 
      initClassrooms={data.classrooms} 
      initAssignments={data.assignments} 
      initExams={data.exams} 
      performanceData={data.performanceData}
      announcements={data.announcements}
    />
  )
}