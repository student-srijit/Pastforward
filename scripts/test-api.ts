// Simple script to test the /api/posts endpoint
const fetch = require("node-fetch")

async function testPostsAPI() {
  try {
    console.log("Testing /api/posts endpoint...")

    // You'll need to get a valid session token somehow
    // For testing, you might need to disable auth temporarily in the API route
    const response = await fetch("http://localhost:3000/api/posts")

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${await response.text()}`)
    }

    const data = await response.json()
    console.log("API Response:", JSON.stringify(data, null, 2))

    if (Array.isArray(data.posts)) {
      console.log(`Successfully fetched ${data.posts.length} posts`)
      data.posts.forEach((post, index) => {
        console.log(`Post ${index + 1}:`, post.id, post.title, post.platform)
      })
    } else {
      console.error("Invalid response format, expected posts array:", data)
    }
  } catch (error) {
    console.error("Error testing API:", error)
  }
}

testPostsAPI()
