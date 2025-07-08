"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Calendar, MapPin, User, ImageIcon, Sparkles, Loader2, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

type PostCreatorProps = {
  setGeneratedPost: (post: any) => void
}

export function PostCreator({ setGeneratedPost }: PostCreatorProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    era: "",
    location: "",
    characterType: "",
    platform: "instagram",
    customPrompt: "",
    generateImage: false,
    creativity: 50,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [generatedPostData, setGeneratedPostData] = useState<any>(null)
  const { toast } = useToast()

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Call our API route instead of directly calling the service
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate post")
      }

      const data = await response.json()

      // Add the user's actual information to the post
      const enhancedPost = {
        ...data.post,
        era: formData.era,
        user: {
          id: session?.user?.id,
          name: session?.user?.name,
          image: session?.user?.image,
          username: session?.user?.email?.split("@")[0] || session?.user?.name?.toLowerCase().replace(/\s+/g, ""),
        },
        username: session?.user?.name,
        avatar: session?.user?.image || "/vibrant-street-market.png",
      }

      setGeneratedPostData(enhancedPost)
      setGeneratedPost(enhancedPost)

      // Show success toast
      toast({
        title: "Post Generated!",
        description: "Your historical social media post has been created. Click Save to Database to publish it.",
        duration: 5000,
      })
    } catch (error) {
      console.error("Error generating post:", error)

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to generate post. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const savePostToDatabase = async () => {
    if (!generatedPostData) return

    setIsSaving(true)

    try {
      const postData = {
        content: generatedPostData.content,
        title: generatedPostData.title || "",
        imageUrl: generatedPostData.image || "",
        era: formData.era,
        year: generatedPostData.date,
        location: formData.location,
        characterType: formData.characterType,
        platform: formData.platform,
        hashtags: generatedPostData.hashtags || [],
        isPublic: false, // Default to private
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        throw new Error("Failed to save post to database")
      }

      const data = await response.json()

      toast({
        title: "Post Saved!",
        description: "Your post has been saved to the database. You can view it in your dashboard.",
        duration: 3000,
      })

      // Redirect to the post page
      router.push(`/post/${data.post.id}`)
    } catch (error) {
      console.error("Error saving post:", error)
      toast({
        title: "Error",
        description: "Failed to save post to database. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const eras = [
    "Ancient Egypt (3000-30 BCE)",
    "Roman Empire (27 BCE-476 CE)",
    "Medieval Europe (500-1500)",
    "Renaissance (1400-1600)",
    "Industrial Revolution (1760-1840)",
    "Victorian Era (1837-1901)",
    "World War I (1914-1918)",
    "Roaring Twenties (1920s)",
    "World War II (1939-1945)",
    "Cold War (1947-1991)",
    "Indian Independence Movement (1857-1947)",
    "Mughal India (1526-1857)",
    "Ancient India (3300 BCE-1200 CE)",
    "Colonial America (1607-1776)",
    "Civil Rights Movement (1954-1968)",
    "Information Age (1970-Present)",
  ]

  const characterTypes = [
    "Royalty/Ruler",
    "Soldier/Warrior",
    "Merchant/Trader",
    "Artist/Musician",
    "Scientist/Inventor",
    "Farmer/Peasant",
    "Religious Leader",
    "Explorer/Adventurer",
    "Philosopher/Scholar",
    "Politician/Diplomat",
    "Common Citizen",
    "Revolutionary",
    "Poet/Writer",
  ]

  const platforms = [
    { value: "instagram", label: "Instagram" },
    { value: "twitter", label: "X (Twitter)" },
    { value: "reddit", label: "Reddit" },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Post Parameters</h2>

        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={cn(
              "px-4 py-2 font-medium text-sm",
              activeTab === "basic"
                ? "border-b-2 border-timeline-600 text-timeline-600"
                : "text-gray-500 dark:text-gray-400",
            )}
            onClick={() => setActiveTab("basic")}
          >
            Basic
          </button>
          <button
            className={cn(
              "px-4 py-2 font-medium text-sm",
              activeTab === "advanced"
                ? "border-b-2 border-timeline-600 text-timeline-600"
                : "text-gray-500 dark:text-gray-400",
            )}
            onClick={() => setActiveTab("advanced")}
          >
            Advanced
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === "basic" ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-timeline-600" />
                  <Label htmlFor="era" className="text-base font-medium">
                    Historical Era
                  </Label>
                </div>
                <Select value={formData.era} onValueChange={(value) => handleChange("era", value)}>
                  <SelectTrigger id="era" className="w-full">
                    <SelectValue placeholder="Select an era" />
                  </SelectTrigger>
                  <SelectContent>
                    {eras.map((era) => (
                      <SelectItem key={era} value={era}>
                        {era}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-timeline-600" />
                  <Label htmlFor="location" className="text-base font-medium">
                    Location
                  </Label>
                </div>
                <Input
                  id="location"
                  placeholder="e.g., Delhi, India or Ancient Rome"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-timeline-600" />
                  <Label htmlFor="characterType" className="text-base font-medium">
                    Character Type
                  </Label>
                </div>
                <Select value={formData.characterType} onValueChange={(value) => handleChange("characterType", value)}>
                  <SelectTrigger id="characterType" className="w-full">
                    <SelectValue placeholder="Select a character type" />
                  </SelectTrigger>
                  <SelectContent>
                    {characterTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform" className="text-base font-medium">
                  Social Media Platform
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {platforms.map((platform) => (
                    <Button
                      key={platform.value}
                      type="button"
                      variant={formData.platform === platform.value ? "default" : "outline"}
                      className={formData.platform === platform.value ? "bg-timeline-600 hover:bg-timeline-700" : ""}
                      onClick={() => handleChange("platform", platform.value)}
                    >
                      {platform.label}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="customPrompt" className="text-base font-medium">
                  Custom Prompt (Optional)
                </Label>
                <Textarea
                  id="customPrompt"
                  placeholder="Add specific details or context for your historical post..."
                  value={formData.customPrompt}
                  onChange={(e) => handleChange("customPrompt", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-timeline-600" />
                  <Label htmlFor="creativity" className="text-base font-medium">
                    Creativity Level
                  </Label>
                </div>
                <div className="pt-2">
                  <Slider
                    id="creativity"
                    min={0}
                    max={100}
                    step={1}
                    value={[formData.creativity]}
                    onValueChange={(value) => handleChange("creativity", value[0])}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Historical Accuracy</span>
                  <span>Creative Freedom</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-timeline-600" />
                    <Label htmlFor="generateImage" className="text-base font-medium">
                      Generate Image
                    </Label>
                  </div>
                  <Switch
                    id="generateImage"
                    checked={formData.generateImage}
                    onCheckedChange={(checked) => handleChange("generateImage", checked)}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Generate an AI image to accompany your historical post
                </p>
              </div>
            </motion.div>
          )}

          <div className="mt-8 flex gap-4">
            <Button
              type="submit"
              className="flex-1 bg-timeline-600 hover:bg-timeline-700 text-white py-6 text-lg"
              disabled={isLoading || !formData.era || !formData.location || !formData.characterType}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Historical Post
                </>
              )}
            </Button>

            {generatedPostData && (
              <Button
                type="button"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                onClick={savePostToDatabase}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save to Database
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
