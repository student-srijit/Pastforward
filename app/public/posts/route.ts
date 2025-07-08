import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    console.log("Public API: Fetching posts")

    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const platform = searchParams.get("platform")

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build the query
    const where: any = {
      isPublic: true,
    }

    // If platform is provided, filter by platform
    if (platform) {
      where.platform = platform
    }

    console.log("Public API: Querying posts with where clause:", where)

    // Get posts with pagination
    const posts = await prisma.post.findMany({
      where,
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
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        hashtags: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    console.log(`Public API: Found ${posts.length} posts`)

    // Get total count for pagination
    const totalPosts = await prisma.post.count({ where })

    // Format posts for the frontend
    const formattedPosts = posts.map((post) => {
      // Base post data
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
        likes: post._count.likes.toString(),
        comments: post._count.comments.toString(),
        hashtags: post.hashtags.map((tag) => tag.name),
        isLiked: false, // Always false for public access
        // Add fields needed by SocialPost component
        username: post.user.name || "User",
        avatar: post.user.image || "/placeholder.svg?height=40&width=40",
        verified: true,
        date: post.year || new Date(post.createdAt).toLocaleDateString(),
      }

      // Add platform-specific fields
      if (post.platform === "twitter") {
        return {
          ...formattedPost,
          handle: `@${post.user.username || post.user.name?.toLowerCase().replace(/\s+/g, "") || "user"}`,
          retweets: Math.floor(post._count.likes / 2).toString(),
          replies: post._count.comments.toString(),
        }
      } else if (post.platform === "reddit") {
        return {
          ...formattedPost,
          subreddit: `r/${post.era.replace(/\s+/g, "")}`,
          upvotes: post._count.likes.toString(),
          awards: post._count.likes > 10 ? ["Gold", "Silver"] : ["Silver"],
        }
      }

      return formattedPost
    })

    console.log(`Public API: Returning ${formattedPosts.length} formatted posts`)

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit),
      },
    })
  } catch (error) {
    console.error("Public API: Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts", posts: [] }, { status: 500 })
  }
}
