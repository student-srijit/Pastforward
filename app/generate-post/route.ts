import { NextResponse } from "next/server"
import { generateHistoricalPost } from "@/lib/ai-service"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 })
    }

    const body = await request.json()
    console.log("Received request to generate post:", body)

    // Generate post with Gemini
    const generatedPost = await generateHistoricalPost(body)
    console.log("Generated post:", generatedPost)

    // Extract hashtags from the generated post
    const hashtags = generatedPost.hashtags || []

    // Save the post to the database
    const savedPost = await prisma.post.create({
      data: {
        content: generatedPost.content,
        title: generatedPost.title || null,
        imageUrl: generatedPost.image || null,
        era: body.era,
        year: generatedPost.date || null,
        location: body.location,
        characterType: body.characterType,
        platform: body.platform,
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

    // Format the post for the frontend
    const formattedPost = {
      ...generatedPost,
      id: savedPost.id,
      era: body.era,
      location: body.location,
      characterType: body.characterType,
      platform: body.platform,
      isPublic: false,
      createdAt: savedPost.createdAt,
      user: savedPost.user,
      username: savedPost.user.name,
      avatar: savedPost.user.image || "/placeholder.svg?height=40&width=40",
      hashtags: savedPost.hashtags.map((tag) => tag.name),
    }

    return NextResponse.json({ post: formattedPost })
  } catch (error) {
    console.error("Error in generate-post API route:", error)
    return NextResponse.json({ error: "Failed to generate post" }, { status: 500 })
  }
}
