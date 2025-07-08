import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt, era } = await request.json()
    
    // Check if API key exists
    if (!process.env.HUGGINGFACE_API_KEY) {
      return NextResponse.json(
        { error: "API key configuration missing" }, 
        { status: 500 }
      )
    }

    // Create a historically appropriate prompt
    const enhancedPrompt = `A historical image from ${era}: ${prompt}. Highly detailed, realistic, professional quality.`

    // Call Hugging Face API with the environment variable
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          options: {
            wait_for_model: true,
          },
        }),
      },
    )

    // Rest of your code remains the same
    if (!response.ok) {
      const error = await response.json()
      console.error("Hugging Face API error:", error)
      return NextResponse.json({ error: "Failed to generate image" }, { status: response.status })
    }

    const imageBuffer = await response.arrayBuffer()

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (error) {
    console.error("Error in generate-image API route:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
