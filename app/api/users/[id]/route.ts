import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id

    // Only allow users to update their own profile
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to update this profile" }, { status: 403 })
    }

    const body = await request.json()
    const { name, username, bio } = body

    // Validate username format
    if (username && !/^[a-z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: "Username can only contain lowercase letters, numbers, and underscores" },
        { status: 400 },
      )
    }

    // Check if username is already taken (if changed)
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      })

      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json({ error: "Username is already taken" }, { status: 400 })
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        username,
        bio,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        bio: true,
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
