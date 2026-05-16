export function auth(): Promise<{ userId: string }> {
  return Promise.resolve({ userId: "user_student_1" })
}

export function currentUser(): Promise<{
  id: string
  firstName: string
  lastName: string
  emailAddresses: { emailAddress: string }[]
} | null> {
  return Promise.resolve({
    id: "user_student_1",
    firstName: "Yasmine",
    lastName: "Badra",
    emailAddresses: [{ emailAddress: "student@peda.dz" }]
  })
}
