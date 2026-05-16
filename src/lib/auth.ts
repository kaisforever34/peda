export type DemoUser = {
  userId: string
  id: string
  name: string
  role: "STUDENT" | "TEACHER" | "ADMIN"
}

export async function auth(): Promise<{ userId: string }> {
  return { userId: "user_teacher_1" }
}

export async function getDemoUser(): Promise<DemoUser> {
  return {
    userId: "user_teacher_1",
    id: "demo_teacher",
    name: "Demo Teacher",
    role: "TEACHER",
  }
}
