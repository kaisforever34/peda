import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is a teacher or admin
    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const submissions = await prisma.submission.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        student: {
          select: { id: true, name: true, email: true }
        },
        assignment: {
          select: { id: true, title: true }
        },
        exam: {
          select: { id: true, title: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 50
    })

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("Error fetching submissions:", error)
    return NextResponse.json({ submissions: [] }, { status: 500 })
  }
}