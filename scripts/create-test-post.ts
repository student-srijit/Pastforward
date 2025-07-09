// Import PrismaClient
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function createTestPost() {
  try {
    console.log("Creating test post...")

    // Get the first user in the database
    const user = await prisma.user.findFirst()

    if (!user) {
      console.error("No user found in the database. Please sign in first.")
      return
    }

    // Create a test post
    const post = await prisma.post.create({
      data: {
        content: "This is a test post created via script. The Roman Senate was quite lively today!",
        title: "A Day in Ancient Rome",
        era: "Roman Empire (27 BCE-476 CE)",
        year: "75 CE",
        location: "Rome, Italy",
        characterType: "Senator",
        platform: "twitter",
        userId: user.id,
        hashtags: {
          connectOrCreate: [
            { where: { name: "AncientRome" }, create: { name: "AncientRome" } },
            { where: { name: "RomanSenate" }, create: { name: "RomanSenate" } },
            { where: { name: "HistoricalPost" }, create: { name: "HistoricalPost" } },
          ],
        },
      },
    })

    console.log("Test post created successfully:", post)
  } catch (error) {
    console.error("Error creating test post:", error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the function
createTestPost()
