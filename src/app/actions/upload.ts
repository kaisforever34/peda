"use server"

import { uploadFile } from "@/lib/storage"
import { auth } from "@clerk/nextjs/server"

export async function uploadAction(formData: FormData) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const file = formData.get("file") as File
    if (!file) throw new Error("No file provided")

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "File too large (max 10MB)" }
    }

    const allowedTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "application/pdf", 
      "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "audio/mpeg", "audio/wav", "audio/webm", "audio/ogg"
    ]

    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "File type not supported" }
    }

    const result = await uploadFile(file)
    return result
  } catch (error: any) {
    console.error("Error uploading file:", error)
    return { success: false, error: error instanceof Error ? error.message : "Upload failed" }
  }
}
