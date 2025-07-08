import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    console.log("API: Fetching posts...")
    const session = await getServerSession(authOptions)

    if (!session) {
      console.log("API: No session found, returning 401")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("API: Session found for user:", session.user.id)

    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const platform = searchParams.get("platform")
    const era = searchParams.get("era")
    const publicOnly = searchParams.get("publicOnly") === "true"
    const userId = searchParams.get("userId")

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build the query
    const where: any = {}

    if (platform) {
      where.platform = platform
    }

    if (era) {
      where.era = era
    }

    // If publicOnly is true, only show public posts
    if (publicOnly) {
      where.isPublic = true
    } else {
      // If not publicOnly, show the user's own posts (public or private)
      // and other users' public posts
      where.OR = [{ userId: session.user.id }, { isPublic: true }]
    }

    // If userId is provided, only show posts from that user
    if (userId) {
      where.userId = userId
    }

    console.log("API: Querying posts with where clause:", where)

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

    console.log(`API: Found ${posts.length} posts`)

    // Get total count for pagination
    const totalPosts = await prisma.post.count({ where })

    // Format posts for the frontend
    const formattedPosts = posts.map((post) => {
      const isLiked = post.likes.some((like) => like.userId === session.user.id)

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
        isLiked,
        // Add fields needed by SocialPost component
        username: post.user.name || "User",
        avatar: post.user.image || "/vibrant-street-market.png",
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

    console.log(`API: Returning ${formattedPosts.length} formatted posts`)

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
    console.error("API: Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { content, title, imageUrl, era, year, location, characterType, platform, hashtags } = body

    // Create the post
    const post = await prisma.post.create({
      data: {
        content,
        title,
        imageUrl,
        era,
        year,
        location,
        characterType,
        platform,
        isPublic: false, // Default to private
        userId: session.user.id,
        hashtags: {
          connectOrCreate: hashtags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
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
        hashtags: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
