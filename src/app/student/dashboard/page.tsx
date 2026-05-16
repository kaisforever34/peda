import { getStudentDashboardData } from "@/app/actions/dashboard"
import StudentDashboardClient from "./dashboard-client"
import { getPeerReviewTask } from "@/app/actions/peer-review"

export default async function StudentDashboardPage() {
  const [data, peerReviewTask] = await Promise.all([
    getStudentDashboardData(),
    getPeerReviewTask()
  ])

  const performanceData = data.performanceProjection 
    ? [
        { name: "Self Eval", score: data.performanceProjection.breakdown.self, average: data.performanceProjection.currentScore },
        { name: "AI Score", score: data.performanceProjection.breakdown.ai, average: data.performanceProjection.currentScore },
        { name: "Peer Review", score: data.performanceProjection.breakdown.peer, average: data.performanceProjection.currentScore },
        { name: "Teacher", score: data.performanceProjection.breakdown.teacher, average: data.performanceProjection.currentScore },
      ]
    : []

  return <StudentDashboardClient 
    {...data} 
    announcements={data.announcements} 
    leaderboard={data.leaderboard} 
    performanceData={performanceData} 
    peerReviewTask={peerReviewTask}
  />
  }