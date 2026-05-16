import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const courses = await prisma.course.findMany({
      where: { status: "PUBLISHED" },
      include: {
        teacher: {
          select: { name: true }
        },
        _count: {
          select: { lessons: true, enrollments: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ courses: [] }, { status: 500 })
  }
}