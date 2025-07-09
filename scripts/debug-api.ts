// This script is for debugging API issues
// Run with: node scripts/debug-api.js

const fetch = require("node-fetch")

async function debugApi() {
  try {
    console.log("Attempting to fetch posts from API...")

    // You'll need to replace this with your actual API URL and authentication
    const response = await fetch("http://localhost:3000/api/posts", {
      headers: {
        // You might need to add authentication headers here
        "Content-Type": "application/json",
      },
    })

    console.log("Response status:", response.status)

    const data = await response.json()
    console.log("Response data:", JSON.stringify(data, null, 2))

    if (Array.isArray(data.posts)) {
      console.log(`Found ${data.posts.length} posts`)
      data.posts.forEach((post, index) => {
        console.log(`Post ${index + 1}:`, {
          id: post.id,
          title: post.title,
          platform: post.platform,
          content: post.content?.substring(0, 50) + "...",
        })
      })
    } else {
      console.log("No posts array found in response:", data)
    }
  } catch (error) {
    console.error("Error debugging API:", error)
  }
}

debugApi()
