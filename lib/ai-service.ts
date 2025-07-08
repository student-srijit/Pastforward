import { GoogleGenerativeAI } from "@google/generative-ai"

type PostParams = {
  era: string
  location: string
  characterType: string
  platform: string
  customPrompt?: string
  generateImage: boolean
  creativity: number
}

export async function generateHistoricalPost(params: PostParams): Promise<any> {
  const { era, location, characterType, platform, customPrompt, creativity } = params

  // Extract era name without dates
  const eraParts = era.split("(")
  const eraName = eraParts[0].trim()
  const eraDates = eraParts[1]?.replace(")", "").trim() || ""

  // Create a prompt for the AI
  const prompt = `Create a ${platform} post for a ${characterType} from ${eraName} (${eraDates}) in ${location}.
${customPrompt ? `Additional context: ${customPrompt}` : ""}

The post should be historically accurate but presented in a social media format with appropriate hashtags.
Use language appropriate to the era but understandable to modern readers.
Include relevant historical details and context.
Create hashtags that blend historical terminology with modern social media conventions.
The tone should match both the character type and the historical context.
Creativity level: ${creativity}% (higher means more creative liberty, lower means stricter historical accuracy).
Platform: ${platform} (adapt the content to fit this platform's style).

Return the result as a JSON object with the following structure:
{
  "username": "historically appropriate username",
  "handle": "username handle if applicable",
  "verified": boolean,
  "date": "historically accurate date",
  "location": "specific location",
  "title": "post title if applicable",
  "content": "the main post content",
  "hashtags": ["array", "of", "hashtags"],
  "subreddit": "if platform is reddit",
  "likes": "engagement metric",
  "comments": "engagement metric",
  "retweets": "engagement metric if applicable",
  "replies": "engagement metric if applicable",
  "upvotes": "engagement metric if applicable",
  "awards": ["array", "of", "awards", "if", "applicable"]
}`

  console.log("Generating post with prompt:", prompt)

  try {
    if (process.env.GEMINI_API_KEY) {
      console.log("Using Gemini API for text generation")

      // Initialize the Gemini API with your API key
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

      // Try different model names
      const modelOptions = ["gemini-1.5-pro", "gemini-pro", "models/gemini-pro", "models/gemini-1.5-pro"]

      let text = ""
      let success = false

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
        }
      }

      if (!success) {
        console.error("Failed to generate content with any available model, falling back to mock data")
        return mockGeneratePost(params)
      }

      console.log("Gemini API response:", text)

      // Try to parse JSON from the response
      try {
        // Look for JSON object in the response
        const jsonMatch = text.match(/({[\s\S]*})/)
        if (jsonMatch) {
          const jsonStr = jsonMatch[0]
          return JSON.parse(jsonStr)
        } else {
          console.error("No JSON found in Gemini response")
          // Fall back to mock implementation
          return mockGeneratePost(params)
        }
      } catch (parseError) {
        console.error("Error parsing JSON from Gemini response:", parseError)
        // Fall back to mock implementation
        return mockGeneratePost(params)
      }
    } else {
      console.log("No Gemini API key found, using mock implementation")
      // Fall back to mock implementation
      return mockGeneratePost(params)
    }
  } catch (error) {
    console.error("Error generating post with Gemini API:", error)
    return mockGeneratePost(params)
  }
}

// Mock implementation as fallback
function mockGeneratePost(params: PostParams): any {
  console.log("Using mock implementation for post generation")
  const { era, location, characterType, platform } = params

  // Extract era name without dates
  const eraParts = era.split("(")
  const eraName = eraParts[0].trim()

  // Generate a random date within the era
  const getRandomDate = () => {
    if (era.includes("BCE")) {
      return `${Math.floor(Math.random() * 1000 + 500)} BCE`
    } else if (era.includes("CE")) {
      return `${Math.floor(Math.random() * 400 + 100)} CE`
    } else if (era.includes("-")) {
      const dates = era.match(/\d+/g)
      if (dates && dates.length >= 2) {
        const startYear = Number.parseInt(dates[0])
        const endYear = Number.parseInt(dates[1])
        return `${Math.floor(Math.random() * (endYear - startYear) + startYear)}`
      }
    }
    return "Historical Date"
  }

  // Generate username based on character type
  const generateUsername = () => {
    const prefixes = ["The", "Royal", "Ancient", "Noble", "Wise", "Brave"]
    const suffixes = ["Scholar", "Warrior", "Poet", "Sage", "Explorer", "Voice"]

    if (characterType.includes("/")) {
      const types = characterType.split("/")
      return `${types[0]}Of${location.split(",")[0].replace(/\s+/g, "")}`
    }

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
    return `${prefix}${suffix}${Math.floor(Math.random() * 100)}`
  }

  // Generate content based on parameters
  const generateContent = () => {
    // This would be AI-generated in a real app
    const contents = {
      "Ancient Egypt":
        "Just finished overseeing the construction of the new pyramid. The workers are exhausted, but the Pharaoh will be pleased. The alignment with the stars is perfect! #PyramidLife #AncientEngineering",
      "Roman Empire":
        "Attended the Colosseum games today. The Emperor put on quite a spectacle! The new gladiator from Thrace is undefeated. Bread and circuses keep the people happy. #GladiatorGames #RomanLife",
      "Medieval Europe":
        "The plague continues to spread through the village. We've lost five more souls today. The monastery is offering prayers, but I fear it's not enough. Lord protect us all. #BlackDeath #MedievalStruggle",
      Renaissance:
        "Just finished a commission for the Medici family. They're demanding patrons but pay well. My new technique for perspective drawing is causing quite a stir among fellow artists. #RenaissanceArt #Perspective",
      "Industrial Revolution":
        "The new steam engine at the factory has doubled our production! Though the working conditions remain harsh, progress marches on. The future is mechanical! #SteamPower #IndustrialAge",
      "Victorian Era":
        "Attended a most fascinating lecture on Mr. Darwin's new theory today. Quite controversial, but the evidence is compelling. The natural world never ceases to amaze. #Evolution #ScientificDiscovery",
      "World War I":
        "Another day in the trenches. The mud, the rats, the constant shelling—will this war ever end? Received a letter from home today, a small comfort in this hell. #GreatWar #TrenchLife",
      "Roaring Twenties":
        "The speakeasy was jumping last night! The new jazz band from New Orleans has everyone talking. Prohibition can't stop the party! #JazzAge #ProhibitionBlues",
      "World War II":
        "Food rationing is getting stricter. Made a cake with beet sugar today—not ideal but we make do. Everyone's doing their part for the war effort. #HomeFont #Rationing",
      "Cold War":
        "The tension in Berlin is palpable. New checkpoint procedures make crossing sectors nearly impossible. Families separated overnight. This wall is more than concrete. #DividedCity #IronCurtain",
      "Indian Independence Movement":
        "Attended Gandhiji's speech today. His message of non-violence resonates deeply, though the path to freedom seems long. The British cannot ignore us forever. #QuitIndia #Satyagraha",
      "Mughal India":
        "The Emperor's new garden is a marvel of design. The fountains, the symmetry—truly paradise on earth. Spent hours sketching the marble inlay patterns. #MughalArchitecture #RoyalPatronage",
    }

    // Default content if specific era not found
    return (
      contents[eraName] ||
      `Reflecting on life in ${eraName} ${location}. As a ${characterType.toLowerCase()}, I've witnessed remarkable changes. The challenges we face shape who we become. #HistoricalThoughts #${eraName.replace(/\s+/g, "")}`
    )
  }

  // Generate hashtags
  const generateHashtags = () => {
    const baseHashtags = [
      eraName.replace(/\s+/g, ""),
      location.split(",")[0].replace(/\s+/g, ""),
      characterType.split("/")[0].replace(/\s+/g, ""),
    ]

    const additionalHashtags = [
      "HistoryMatters",
      "TimeTravel",
      "HistoricalPerspective",
      "PastForward",
      "HistoryRewritten",
      "TimelessThoughts",
    ]

    // Select 2-3 random additional hashtags
    const selected = []
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * additionalHashtags.length)
      selected.push(additionalHashtags[randomIndex])
      additionalHashtags.splice(randomIndex, 1)
    }

    return [...baseHashtags, ...selected]
  }

  // Generate engagement metrics
  const generateEngagement = () => {
    return {
      likes: `${Math.floor(Math.random() * 100) + 1}.${Math.floor(Math.random() * 9)}K`,
      comments: `${Math.floor(Math.random() * 900) + 100}`,
      retweets: `${Math.floor(Math.random() * 50) + 1}.${Math.floor(Math.random() * 9)}K`,
      replies: `${Math.floor(Math.random() * 500) + 100}`,
      upvotes: `${Math.floor(Math.random() * 20) + 1}.${Math.floor(Math.random() * 9)}K`,
    }
  }

  // Base post data
  const basePost = {
    username: generateUsername(),
    avatar: "/placeholder.svg?height=40&width=40",
    verified: Math.random() > 0.5,
    date: getRandomDate(),
    location: location,
    content: generateContent(),
    hashtags: generateHashtags(),
    ...generateEngagement(),
  }

  // Platform-specific additions
  if (platform === "instagram") {
    return {
      ...basePost,
      platform: "instagram",
      image: params.generateImage ? "/placeholder.svg?height=400&width=400" : undefined,
    }
  } else if (platform === "twitter") {
    return {
      ...basePost,
      platform: "twitter",
      handle: `@${basePost.username.toLowerCase()}`,
    }
  } else if (platform === "reddit") {
    return {
      ...basePost,
      platform: "reddit",
      subreddit: `r/${eraName.replace(/\s+/g, "")}`,
      title: `${characterType}'s perspective on ${eraName} life in ${location}`,
      awards: ["Gold", "Silver", "Helpful"].slice(0, Math.floor(Math.random() * 3) + 1),
    }
  }

  return basePost
}
