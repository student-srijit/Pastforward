"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SocialPost } from "@/components/social-post"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Loader2, Heart, MessageCircle, Share2, ArrowLeft, Trash2, Globe, Lock, Pencil, Copy } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { HistoricalContext } from "@/components/historical-context"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string
    image: string
    username: string
  }
}

export default function PostPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [post, setPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isTogglingPublic, setIsTogglingPublic] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log("Fetching post with ID:", params.id)

        // First try to fetch from the API
        const response = await fetch(`/api/posts/${params.id}`)
        console.log("API response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Error fetching post:", response.status, errorText)
          throw new Error(`Failed to fetch post: ${response.status}`)
        }

        const data = await response.json()
        console.log("Post data received:", data)

        if (!data.post) {
          throw new Error("Post data not found in response")
        }

        // Check if the user is authorized to view this post
        // Only the post creator can access /post/[id]
        if (session?.user?.id !== data.post.user.id) {
          setIsAuthorized(false)
          // Redirect to the share page instead
          router.push(`/share/${params.id}`)
          return
        }

        setIsAuthorized(true)
        setPost(data.post)
        setIsLiked(data.post.isLiked || false)
      } catch (error) {
        console.error("Error in fetchPost:", error)
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
      // Redirect to login if not authenticated
      router.push(`/auth/signin?callbackUrl=/post/${params.id}`)
    }
  }, [params.id, session, status, router, toast])

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}/like`, {
        method: isLiked ? "DELETE" : "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to like/unlike post")
      }

      setIsLiked(!isLiked)

      // Update like count in the post object
      setPost((prev) => ({
        ...prev,
        likes: isLiked ? (Number.parseInt(prev.likes) - 1).toString() : (Number.parseInt(prev.likes) + 1).toString(),
      }))
    } catch (error) {
      console.error("Error liking/unliking post:", error)
      toast({
        title: "Error",
        description: "Failed to like/unlike post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/posts/${params.id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment }),
      })

      if (!response.ok) {
        throw new Error("Failed to add comment")
      }

      const data = await response.json()

      // Add the new comment to the post
      setPost((prev) => ({
        ...prev,
        comments: [data.comment, ...prev.comments],
      }))

      setComment("")

      toast({
        title: "Success",
        description: "Comment added successfully",
      })
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      toast({
        title: "Success",
        description: "Post deleted successfully",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTogglePublic = async () => {
    setIsTogglingPublic(true)
    try {
      const response = await fetch(`/api/posts/${params.id}/toggle-public`, {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error("Failed to update post visibility")
      }

      const data = await response.json()

      // Update the post state with the new isPublic value
      setPost((prev) => ({
        ...prev,
        isPublic: data.post.isPublic,
      }))

      toast({
        title: "Success",
        description: data.message,
      })
    } catch (error) {
      console.error("Error toggling post visibility:", error)
      toast({
        title: "Error",
        description: "Failed to update post visibility. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTogglingPublic(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !post || !isAuthorized) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Error Loading Post</h2>
            <p className="text-red-500 dark:text-red-400 mb-2">{error || "Post not found or unauthorized"}</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The post you're looking for doesn't exist, couldn't be loaded, or you don't have permission to view it.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline">
                <Loader2 className="mr-2 h-4 w-4" />
                Retry
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

          <div className="flex items-center gap-2">
            {session && post.user && post.user.id === session.user.id && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-2"
                >
                  <Button
                    variant={post.isPublic ? "default" : "outline"}
                    size="sm"
                    onClick={handleTogglePublic}
                    disabled={isTogglingPublic}
                    className={post.isPublic ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {isTogglingPublic ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : post.isPublic ? (
                      <Globe className="mr-2 h-4 w-4" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    {post.isPublic ? "Public" : "Make Public"}
                  </Button>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/edit/${params.id}`)}
                      className="border-instagram-blue text-instagram-blue hover:bg-instagram-blue/10"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="destructive" size="sm" onClick={handleDeletePost}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            )}
            <HistoricalContext era={post.era} location={post.location} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <SocialPost type={post.platform} post={post} />
            </motion.div>

            <div className="mt-6 flex gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={isLiked ? "default" : "outline"}
                  className={isLiked ? "bg-red-500 hover:bg-red-600" : ""}
                  onClick={handleLike}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                  {isLiked ? "Liked" : "Like"}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Comment
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/share/${post.id}`
                    navigator.clipboard.writeText(shareUrl)
                    toast({
                      title: "Link Copied",
                      description: "Post link copied to clipboard",
                    })
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </motion.div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Comments ({post.comments?.length || 0})</h3>

              <form onSubmit={handleComment} className="mb-6">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                    <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="mb-2"
                    />
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button type="submit" disabled={isSubmitting || !comment.trim()}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          "Post Comment"
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </form>

              {post.comments && post.comments.length > 0 ? (
                <div className="space-y-4">
                  {post.comments.map((comment: Comment, index: number) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={comment.user.image || ""} alt={comment.user.name || "User"} />
                              <AvatarFallback>{comment.user.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold">{comment.user.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <p>{comment.content}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">About the Author</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={post.user?.image || ""} alt={post.user?.name || "User"} />
                      <AvatarFallback>{post.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{post.user?.name || "Anonymous"}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">@{post.user?.username || "user"}</div>
                    </div>
                  </div>
                  {post.user && (
                    <Button
                      variant="outline"
                      className="w-full mb-4"
                      onClick={() => router.push(`/profile/${post.user.id}`)}
                    >
                      View Profile
                    </Button>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium">Historical Era</h4>
                    <p className="text-sm">{post.era}</p>

                    {post.location && (
                      <>
                        <h4 className="font-medium">Location</h4>
                        <p className="text-sm">{post.location}</p>
                      </>
                    )}

                    {post.characterType && (
                      <>
                        <h4 className="font-medium">Character Type</h4>
                        <p className="text-sm">{post.characterType}</p>
                      </>
                    )}

                    <h4 className="font-medium">Hashtags</h4>
                    <div className="flex flex-wrap gap-2">
                      {post.hashtags &&
                        post.hashtags.map((tag: string) => (
                          <div key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs">
                            #{tag}
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-4"
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Post Stats</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="text-2xl font-bold">{post.likes || "0"}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Likes</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="text-2xl font-bold">{post.comments?.length || "0"}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Comments</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="text-2xl font-bold">{post.isPublic ? "Yes" : "No"}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Public</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Share Link</h4>
                    <div className="flex">
                      <Input value={`${window.location.origin}/share/${post.id}`} readOnly className="text-xs" />
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/share/${post.id}`)
                          toast({
                            title: "Copied!",
                            description: "Share link copied to clipboard",
                          })
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
