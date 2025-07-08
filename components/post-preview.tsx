"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SocialPost } from "@/components/social-post"
import { Download, Share2, RefreshCw, ImageIcon, Volume2, Loader2, VolumeX, Save, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { ConfettiEffect } from "./confetti-effect"
import { HistoricalContext } from "./historical-context"
import { speakHistoricalPost } from "@/lib/speech-service"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

type PostPreviewProps = {
  generatedPost: any
  setGeneratedPost: (post: any) => void
}

export function PostPreview({ generatedPost, setGeneratedPost }: PostPreviewProps) {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)
  const [isShimmering, setIsShimmering] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isTogglingPublic, setIsTogglingPublic] = useState(false)
  const [customImage, setCustomImage] = useState<string | null>(null)
  const [savedPostId, setSavedPostId] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (generatedPost) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [generatedPost])

  const handleDownload = () => {
    setIsShimmering(true)
    setTimeout(() => setIsShimmering(false), 1000)

    toast({
      title: "Success!",
      description: "Post downloaded successfully.",
      duration: 3000,
    })
  }

  const handleShare = () => {
    if (!savedPostId) {
      toast({
        title: "Save First",
        description: "Please save your post to the database before sharing.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setIsShimmering(true)
    setTimeout(() => setIsShimmering(false), 1000)

    // Create a shareable URL with the post ID
    const shareUrl = `${window.location.origin}/share/${savedPostId}`

    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator
        .share({
          title: `Historical ${generatedPost?.platform || "social media"} post from ${generatedPost?.era || "history"}`,
          text: generatedPost?.content || "Check out this historical post!",
          url: shareUrl,
        })
        .catch((error) => {
          console.error("Error sharing:", error)
          navigator.clipboard.writeText(shareUrl)
          toast({
            title: "Share Link Copied",
            description: "Share link has been copied to clipboard.",
            duration: 3000,
          })
        })
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Share Link Copied",
        description: "Share link has been copied to clipboard.",
        duration: 3000,
      })
    }
  }

  const handleRegeneratePost = async () => {
    if (!generatedPost) return

    setIsShimmering(true)
    setTimeout(() => setIsShimmering(false), 1000)

    // In a real implementation, you would call your API to regenerate the post
    // For now, we'll just simulate it with a timeout
    toast({
      title: "Regenerating...",
      description: "Creating a new version of your historical post.",
      duration: 2000,
    })

    // Simulate API call
    setTimeout(() => {
      // Create a slightly modified version of the post
      const regeneratedPost = {
        ...generatedPost,
        content: generatedPost.content
          .split(" ")
          .sort(() => 0.5 - Math.random())
          .join(" "),
        likes: `${Math.floor(Math.random() * 100) + 1}.${Math.floor(Math.random() * 9)}K`,
        comments: `${Math.floor(Math.random() * 900) + 100}`,
      }

      setGeneratedPost(regeneratedPost)
      setCustomImage(null) // Reset custom image
      setSavedPostId(null) // Reset saved post ID
      setIsPublic(false) // Reset public status

      toast({
        title: "Success!",
        description: "Your post has been regenerated.",
        duration: 3000,
      })
    }, 2000)
  }

  const handleGenerateImage = async () => {
    if (!generatedPost) return

    setIsGeneratingImage(true)
    setIsShimmering(true)

    try {
      // Call our API route that uses Hugging Face
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: generatedPost.content,
          era: generatedPost.era,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      // Get the image as a blob
      const imageBlob = await response.blob()
      const imageUrl = URL.createObjectURL(imageBlob)

      setCustomImage(imageUrl)

      toast({
        title: "Image Generated!",
        description: "Your historical image has been created.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsGeneratingImage(false)
      setIsShimmering(false)
    }
  }

  const handleGenerateVoice = async () => {
    if (!generatedPost) return

    if (isSpeaking) {
      // Stop speaking if already in progress
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    setIsGeneratingVoice(true)

    try {
      // Use our speech service
      const success = await speakHistoricalPost(generatedPost.content, generatedPost.era || "")

      if (success) {
        setIsSpeaking(true)

        // Listen for the end of speech
        const checkSpeaking = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            setIsSpeaking(false)
            clearInterval(checkSpeaking)
          }
        }, 100)

        toast({
          title: "Speaking...",
          description: "Your historical post is being read aloud.",
          duration: 2000,
        })
      } else {
        throw new Error("Failed to generate speech")
      }
    } catch (error) {
      console.error("Error generating voice:", error)
      toast({
        title: "Error",
        description: "Failed to generate voice. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsGeneratingVoice(false)
    }
  }

  const savePostToDatabase = async () => {
    if (!generatedPost) return

    setIsSaving(true)

    try {
      const postData = {
        content: generatedPost.content,
        title: generatedPost.title || "",
        imageUrl: customImage || generatedPost.image || "",
        era: generatedPost.era,
        year: generatedPost.date,
        location: generatedPost.location,
        characterType: generatedPost.characterType,
        platform: generatedPost.platform,
        hashtags: generatedPost.hashtags || [],
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
      setSavedPostId(data.post.id)

      toast({
        title: "Post Saved!",
        description: "Your post has been saved to the database. You can now share it or make it public.",
        duration: 3000,
      })
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

  const togglePublic = async () => {
    if (!savedPostId) {
      toast({
        title: "Save First",
        description: "Please save your post to the database before making it public.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setIsTogglingPublic(true)

    try {
      const response = await fetch(`/api/posts/${savedPostId}/toggle-public`, {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error("Failed to update post visibility")
      }

      const data = await response.json()
      setIsPublic(data.post.isPublic)

      toast({
        title: "Success!",
        description: data.message,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error toggling post visibility:", error)
      toast({
        title: "Error",
        description: "Failed to update post visibility. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsTogglingPublic(false)
    }
  }

  const postWithCustomImage =
    generatedPost && customImage
      ? {
          ...generatedPost,
          image: customImage,
        }
      : generatedPost

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-full">
      {showConfetti && <ConfettiEffect />}

      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Preview</h2>

          {/* Add the HistoricalContext component when a post is generated */}
          {generatedPost && (
            <HistoricalContext era={generatedPost.era || "Unknown Era"} location={generatedPost.location} />
          )}
        </div>

        <div className="flex-grow">
          <AnimatePresence mode="wait">
            {generatedPost ? (
              <motion.div
                key="post"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className={cn("perspective-container", isShimmering && "shimmer")}
              >
                <SocialPost type={generatedPost.platform || "instagram"} post={postWithCustomImage} />

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Button
                    onClick={handleGenerateImage}
                    className="flex-1 bg-instagram-blue hover:bg-instagram-blue/90"
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
                  <Button
                    onClick={handleGenerateVoice}
                    variant={isSpeaking ? "default" : "outline"}
                    className={cn("flex-1", isSpeaking && "bg-instagram-pink2 hover:bg-instagram-pink2/90")}
                    disabled={isGeneratingVoice}
                  >
                    {isGeneratingVoice ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        {isSpeaking ? (
                          <>
                            <VolumeX className="mr-2 h-4 w-4" />
                            Stop Speaking
                          </>
                        ) : (
                          <>
                            <Volume2 className="mr-2 h-4 w-4" />
                            Speak Post
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  {!savedPostId ? (
                    <Button
                      onClick={savePostToDatabase}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save to Database
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={togglePublic}
                      className={isPublic ? "flex-1 bg-green-600 hover:bg-green-700" : "flex-1"}
                      disabled={isTogglingPublic}
                    >
                      {isTogglingPublic ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Globe className="mr-2 h-4 w-4" />
                          {isPublic ? "Public" : "Make Public"}
                        </>
                      )}
                    </Button>
                  )}

                  <Button onClick={handleShare} variant="outline" className="flex-1" disabled={!savedPostId}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>

                <div className="mt-4 flex gap-4">
                  <Button onClick={handleDownload} className="flex-1 bg-timeline-600 hover:bg-timeline-700">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>

                  {savedPostId && (
                    <Button onClick={() => router.push(`/post/${savedPostId}`)} className="flex-1">
                      View Post
                    </Button>
                  )}
                </div>

                <div className="mt-4">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-500 dark:text-gray-400"
                    onClick={handleRegeneratePost}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate Another Version
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-center p-8"
              >
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-timeline-600"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"
                        fill="currentColor"
                      />
                    </svg>
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Post Generated Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Fill in the parameters on the left and click "Generate Historical Post" to see your creation here.
                </p>
                <div className="w-full max-w-md h-40 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 dark:text-gray-500">Preview will appear here</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
