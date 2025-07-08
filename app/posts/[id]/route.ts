import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log("API: Fetching post with ID:", params.id)
    const session = await getServerSession(authOptions)

    // Allow public access to posts that are marked as public
    const postId = params.id

    // First, check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        hashtags: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!post) {
      console.log("API: Post not found")
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if the post is public or if the user is the owner
    const isOwner = session?.user?.id === post.userId
    const isPublic = post.isPublic

    if (!isPublic && !isOwner && !session) {
      console.log("API: Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user has liked the post
    const isLiked = session ? post.likes.some((like) => like.userId === session.user.id) : false

    // Format post for the frontend
    const formattedPost = {
      id: post.id,
      content: post.content,
      title: post.title,
      imageUrl: post.imageUrl,
      era: post.era,
      year: post.year,
      location: post.location,
      characterType: post.characterType,
      platform: post.platform,
      createdAt: post.createdAt,
      isPublic: post.isPublic,
      user: {
        id: post.user.id,
        name: post.user.name,
        image: post.user.image,
        username: post.user.username,
      },
      likes: post.likes.length.toString(),
      comments: post.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          image: comment.user.image,
          username: comment.user.username,
        },
      })),
      hashtags: post.hashtags.map((tag) => tag.name),
      isLiked,
      // Add platform-specific fields
      username: post.user.name || "User",
      avatar: post.user.image || "/placeholder.svg?height=40&width=40",
      verified: true,
      date: post.year || new Date(post.createdAt).toLocaleDateString(),
      ...(post.platform === "twitter" && {
        handle: `@${post.user.username || post.user.name?.toLowerCase().replace(/\s+/g, "") || "user"}`,
        retweets: Math.floor(post.likes.length / 2).toString(),
        replies: post.comments.length.toString(),
      }),
      ...(post.platform === "reddit" && {
        subreddit: `r/${post.era.replace(/\s+/g, "")}`,
        upvotes: post.likes.length.toString(),
        awards: post.likes.length > 10 ? ["Gold", "Silver"] : ["Silver"],
      }),
    }

    console.log("API: Successfully fetched post")
    return NextResponse.json({ post: formattedPost })
  } catch (error) {
    console.error("API: Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const postId = params.id
    const body = await request.json()
    const { content, title, imageUrl, hashtags } = body

    // Check if post exists and belongs to the user
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (post.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to update this post" }, { status: 403 })
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        content,
        title,
        imageUrl,
        // Handle hashtags
        hashtags: {
          set: [], // Remove existing connections
          connectOrCreate: hashtags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    })

    return NextResponse.json({ post: updatedPost })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const postId = params.id

    // Check if post exists and belongs to the user
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (post.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to delete this post" }, { status: 403 })
    }

    // Delete the post
    await prisma.post.delete({
      where: { id: postId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
