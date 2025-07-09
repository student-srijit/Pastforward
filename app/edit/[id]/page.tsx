"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Save, Trash2 } from "lucide-react"
import { SocialPost } from "@/components/social-post"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export default function EditPostPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [post, setPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    content: "",
    title: "",
    hashtags: [] as string[],
  })

  // Preview state
  const [previewPost, setPreviewPost] = useState<any>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/posts/${params.id}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.status}`)
        }

        const data = await response.json()

        if (!data.post) {
          throw new Error("Post data not found in response")
        }

        // Check if the user is the owner of the post
        if (data.post.user.id !== session?.user.id) {
          router.push("/dashboard")
          toast({
            title: "Unauthorized",
            description: "You can only edit your own posts",
            variant: "destructive",
          })
          return
        }

        setPost(data.post)
        setFormData({
          content: data.post.content,
          title: data.post.title || "",
          hashtags: data.post.hashtags || [],
        })
        setPreviewPost(data.post)
      } catch (error) {
        console.error("Error fetching post:", error)
        setError(error instanceof Error ? error.message : "Failed to load post")
        toast({
          title: "Error",
          description: "Failed to load post. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchPost()
    } else if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [params.id, session, status, router, toast])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Update preview
    setPreviewPost((prev) => ({
      ...prev,
      [field]: value,
      // Special handling for hashtags
      ...(field === "hashtags" && { hashtags: value.split(",").map((tag: string) => tag.trim()) }),
    }))
  }

  const handleHashtagsChange = (value: string) => {
    const hashtagsArray = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
    setFormData((prev) => ({ ...prev, hashtags: hashtagsArray }))
    setPreviewPost((prev) => ({ ...prev, hashtags: hashtagsArray }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: formData.content,
          title: formData.title,
          hashtags: formData.hashtags,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update post")
      }

      toast({
        title: "Success",
        description: "Post updated successfully",
      })

      router.push(`/post/${params.id}`)
    } catch (error) {
      console.error("Error updating post:", error)
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !post) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Error Loading Post</h2>
            <p className="text-red-500 dark:text-red-400 mb-2">{error || "Post not found"}</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The post you're looking for doesn't exist or couldn't be loaded.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Edit Post</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Edit Your Post</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {post.platform === "reddit" && (
                    <div className="space-y-2">
                      <label htmlFor="title" className="block text-sm font-medium">
                        Title
                      </label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="Post title"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="content" className="block text-sm font-medium">
                      Content
                    </label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleChange("content", e.target.value)}
                      placeholder="Post content"
                      className="min-h-[200px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="hashtags" className="block text-sm font-medium">
                      Hashtags (comma separated)
                    </label>
                    <Input
                      id="hashtags"
                      value={formData.hashtags.join(", ")}
                      onChange={(e) => handleHashtagsChange(e.target.value)}
                      placeholder="history, renaissance, art"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>

                    <Button type="button" variant="destructive" onClick={() => router.push(`/post/${params.id}`)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>{previewPost && <SocialPost type={previewPost.platform} post={previewPost} />}</CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
