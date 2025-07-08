import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log("Public API: Fetching post with ID:", params.id)

    const postId = params.id

    // Only fetch posts that are marked as public
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        isPublic: true,
      },
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
      console.log("Public API: Post not found or not public")
      return NextResponse.json({ error: "Post not found or not public" }, { status: 404 })
    }

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
      isLiked: false, // Always false for public access
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

    console.log("Public API: Successfully fetched post")
    return NextResponse.json({ post: formattedPost })
  } catch (error) {
    console.error("Public API: Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}
