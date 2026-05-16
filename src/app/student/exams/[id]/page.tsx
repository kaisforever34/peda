import { getStudentExam } from "@/app/actions/exam-student"
import { notFound } from "next/navigation"
import ExamPlayerClient from "./exam-player-client"

export default async function ExamPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const exam = await getStudentExam(id)

  if (!exam) notFound()

  return <ExamPlayerClient exam={exam} />
}
