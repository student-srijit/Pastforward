"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ImageIcon, Volume2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { speakHistoricalPost } from "@/lib/speech-service"

export default function TestPage() {
  const [imagePrompt, setImagePrompt] = useState("A Roman soldier in front of the Colosseum")
  const [era, setEra] = useState("Roman Empire")
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [speechText, setSpeechText] = useState("Friends, Romans, countrymen, lend me your ears!")
  const { toast } = useToast()

  const testHuggingFaceImageGeneration = async () => {
    setIsGeneratingImage(true)
    try {
      // Call our API route that uses Hugging Face
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          era: era,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      // Get the image as a blob
      const imageBlob = await response.blob()
      const imageUrl = URL.createObjectURL(imageBlob)

      setGeneratedImage(imageUrl)

      toast({
        title: "Success!",
        description: "Image generated successfully using Hugging Face API.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Error",
        description: "Failed to generate image. Please check your API key and try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const testWebSpeechAPI = async () => {
    try {
      const success = await speakHistoricalPost(speechText, era)

      if (success) {
        toast({
          title: "Speaking...",
          description: "Your text is being read aloud using Web Speech API.",
          duration: 3000,
        })
      } else {
        throw new Error("Failed to generate speech")
      }
    } catch (error) {
      console.error("Error generating speech:", error)
      toast({
        title: "Error",
        description: "Failed to generate speech. Your browser may not support Web Speech API.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            <span className="text-gradient">Integration Test</span> Page
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto text-center mb-16">
            Test the Hugging Face image generation and Web Speech API integrations
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Hugging Face Image Generation Test */}
            <Card>
              <CardHeader>
                <CardTitle>Hugging Face Image Generation</CardTitle>
                <CardDescription>Test the Hugging Face Stable Diffusion integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="imagePrompt">Image Prompt</Label>
                    <Input
                      id="imagePrompt"
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Describe the image you want to generate"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="era">Historical Era</Label>
                    <Input
                      id="era"
                      value={era}
                      onChange={(e) => setEra(e.target.value)}
                      placeholder="e.g., Roman Empire, Renaissance, etc."
                    />
                  </div>

                  <Button
                    onClick={testHuggingFaceImageGeneration}
                    className="w-full bg-instagram-blue hover:bg-instagram-blue/90"
                    disabled={isGeneratingImage}
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Generate Image
                      </>
                    )}
                  </Button>

                  {generatedImage && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Generated Image:</p>
                      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                        <img
                          src={generatedImage || "/placeholder.svg"}
                          alt="Generated"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Web Speech API Test */}
            <Card>
              <CardHeader>
                <CardTitle>Web Speech API</CardTitle>
                <CardDescription>Test the Web Speech API text-to-speech integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="speechText">Text to Speak</Label>
                    <Input
                      id="speechText"
                      value={speechText}
                      onChange={(e) => setSpeechText(e.target.value)}
                      placeholder="Enter text to be spoken"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="speechEra">Historical Era (affects voice selection)</Label>
                    <Input
                      id="speechEra"
                      value={era}
                      onChange={(e) => setEra(e.target.value)}
                      placeholder="e.g., Roman Empire, Renaissance, etc."
                    />
                  </div>

                  <Button onClick={testWebSpeechAPI} className="w-full bg-instagram-pink2 hover:bg-instagram-pink2/90">
                    <Volume2 className="mr-2 h-4 w-4" />
                    Speak Text
                  </Button>

                  <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Notes:</p>
                    <ul className="text-sm list-disc list-inside space-y-1">
                      <li>Web Speech API is built into modern browsers</li>
                      <li>Voice selection varies by browser and operating system</li>
                      <li>Some browsers may require user interaction before audio can play</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
