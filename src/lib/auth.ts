export type DemoUser = {
  userId: string
  id: string
  name: string
  role: "STUDENT" | "TEACHER" | "ADMIN"
}

export async function auth(): Promise<{ userId: string }> {
  return { userId: "user_student_1" }
}

export async function getDemoUser(): Promise<DemoUser> {
  return {
    userId: "user_student_1",
    id: "demo_student",
    name: "Demo Student",
    role: "STUDENT",
  }
}
