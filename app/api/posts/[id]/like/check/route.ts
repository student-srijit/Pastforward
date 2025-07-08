import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ isLiked: false })
    }

    const postId = params.id
    const userId = session.user.id

    // Check if the user has liked this post
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })

    return NextResponse.json({ isLiked: !!like })
  } catch (error) {
    console.error("Error checking like status:", error)
    return NextResponse.json({ error: "Failed to check like status" }, { status: 500 })
  }
}
