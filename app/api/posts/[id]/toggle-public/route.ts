import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const postId = params.id

    // Check if post exists and belongs to the user
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true, isPublic: true },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (post.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to update this post" }, { status: 403 })
    }

    // Toggle the public status
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        isPublic: !post.isPublic,
      },
    })

    return NextResponse.json({
      post: updatedPost,
      message: updatedPost.isPublic ? "Post is now public" : "Post is now private",
    })
  } catch (error) {
    console.error("Error toggling post public status:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}
