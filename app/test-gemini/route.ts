import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: Request) {
  try {
    const { prompt, apiKey } = await request.json()

    // Use the provided API key or fall back to the environment variable
    const geminiApiKey = apiKey || process.env.GEMINI_API_KEY

    if (!geminiApiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 })
    }

    console.log("Testing Gemini API with prompt:", prompt)

    // Initialize the Gemini API with the API key
    const genAI = new GoogleGenerativeAI(geminiApiKey)

    // Try different model names
    const modelOptions = ["gemini-1.5-pro", "gemini-pro", "models/gemini-pro", "models/gemini-1.5-pro"]

    let text = ""
    let success = false
    let lastError = null

    // Try each model name until one works
    for (const modelName of modelOptions) {
      try {
        console.log(`Trying model: ${modelName}`)
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent(prompt)
        const response = await result.response
        text = response.text()
        console.log(`Success with model ${modelName}`)
        success = true
        break
      } catch (modelError) {
        console.error(`Error with model ${modelName}:`, modelError)
        lastError = modelError
      }
    }

    if (!success) {
      return NextResponse.json(
        {
          error: `Failed to generate content with any available model: ${lastError instanceof Error ? lastError.message : "Unknown error"}`,
        },
        { status: 500 },
      )
    }

    console.log("Gemini API response:", text)
    return NextResponse.json({ text })
  } catch (error) {
    console.error("Error in test-gemini API route:", error)
    return NextResponse.json(
      {
        error: `Failed to get response from Gemini API: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
