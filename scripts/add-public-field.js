// This script adds the isPublic field to existing posts
// Run with: npx tsx scripts/add-public-field.js

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function addPublicFieldToPosts() {
  try {
    console.log("Adding isPublic field to existing posts...")

    // Get all posts that don't have the isPublic field set
    const posts = await prisma.post.findMany()

    console.log(`Found ${posts.length} posts to update`)

    // Update each post to set isPublic to false (default)
    for (const post of posts) {
      await prisma.post.update({
        where: { id: post.id },
        data: { isPublic: false },
      })
    }

    console.log("Successfully updated all posts")
  } catch (error) {
    console.error("Error updating posts:", error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the function
addPublicFieldToPosts()
