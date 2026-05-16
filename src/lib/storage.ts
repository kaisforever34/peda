import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { logger } from "./logger"

export async function uploadFile(file: File, folder: string = "uploads") {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = join(process.cwd(), "public", folder)
    await mkdir(uploadDir, { recursive: true })

    const extension = file.name.split(".").pop()
    const filename = `${uuidv4()}.${extension}`
    const path = join(uploadDir, filename)

    await writeFile(path, buffer)
    
    return {
      success: true,
      url: `/${folder}/${filename}`,
      filename
    }
  } catch (error) {
    logger.error("Storage error", error)
    return { success: false, error: "Failed to upload file" }
  }
}
