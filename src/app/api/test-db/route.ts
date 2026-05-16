import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    const userCount = await prisma.user.count()
    return NextResponse.json({ success: true, userCount })
  } catch (err: any) {
    console.error("Database connection error:", err)
    return NextResponse.json({ 
      success: false, 
      error: process.env.NODE_ENV === "development" ? err.message : "Database connection failed"
    }, { status: 500 })
  }
}
