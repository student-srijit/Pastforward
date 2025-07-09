"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SocialPost } from "@/components/social-post"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Loader2, ArrowLeft, Share2, Heart, MessageCircle } from "lucide-react"
import { HistoricalContext } from "@/components/historical-context"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { ParticleBackground } from "@/components/particle-background"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { useSession } from "next-auth/react"

export default function SharePostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()
  const [post, setPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log("Fetching public post with ID:", params.id)

        // Fetch from the public API
        const response = await fetch(`/api/public/posts/${params.id}`)
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

        setPost(data.post)

        // Check if the user has liked this post (if authenticated)
        if (session) {
          try {
            const likeResponse = await fetch(`/api/posts/${params.id}/like/check`, {
              method: "GET",
            })
            if (likeResponse.ok) {
              const likeData = await likeResponse.json()
              setIsLiked(likeData.isLiked)
            }
          } catch (likeError) {
            console.error("Error checking like status:", likeError)
          }
        }
      } catch (error) {
        console.error("Error in fetchPost:", error)
        setError(error instanceof Error ? error.message : "Failed to load post")
        toast({
          title: "Error",
          description: "Failed to load post. This post may not be public or may not exist.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [params.id, toast, session])

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/share/${params.id}`
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Link Copied",
      description: "Post link copied to clipboard",
    })
  }

  const handleLike = async () => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like posts",
        variant: "destructive",
      })
      return
    }

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

      toast({
        title: isLiked ? "Unliked" : "Liked",
        description: isLiked ? "You've unliked this post" : "You've liked this post",
      })
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

    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to comment on posts",
        variant: "destructive",
      })
      return
    }

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  if (isLoading) {
    return (
      <main className="min-h-screen relative">
        <ParticleBackground />
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="min-h-screen relative">
        <ParticleBackground />
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Error Loading Post</h2>
            <p className="text-red-500 dark:text-red-400 mb-2">{error || "Post not found"}</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">This post may not be public or may not exist.</p>
            <div className="flex justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => router.push("/")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => window.location.reload()} variant="outline">
                  <Loader2 className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen relative">
      <ParticleBackground />
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 flex items-center justify-between"
        >
          <motion.div variants={itemVariants}>
            <Button variant="ghost" onClick={() => router.push("/")} className="group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-[-2px] transition-transform" />
              Back to Home
            </Button>
          </motion.div>
          <motion.div variants={itemVariants}>
            <HistoricalContext era={post.era} location={post.location} />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div className="lg:col-span-2" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <SocialPost type={post.platform} post={post} />
            </motion.div>

            <motion.div variants={itemVariants} className="mt-6 flex gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={isLiked ? "default" : "outline"}
                  className={isLiked ? "bg-red-500 hover:bg-red-600" : ""}
                  onClick={handleLike}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                  {isLiked ? "Liked" : "Like"} ({post.likes})
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" onClick={() => document.getElementById("comment-section")?.focus()}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Comment ({post.comments?.length || 0})
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8">
              <h3 className="text-xl font-semibold mb-4" id="comment-section">
                Comments ({post.comments?.length || 0})
              </h3>

              {session ? (
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
              ) : (
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6 text-center">
                  <p className="mb-2">Sign in to leave a comment</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() =>
                        router.push("/auth/signin?callbackUrl=" + encodeURIComponent(window.location.pathname))
                      }
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </div>
              )}

              <AnimatePresence>
                {post.comments && post.comments.length > 0 ? (
                  <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                    {post.comments.map((comment: any, index: number) => (
                      <motion.div
                        key={comment.id}
                        variants={itemVariants}
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
                  </motion.div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          <motion.div className="lg:col-span-1" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
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

            <motion.div variants={itemVariants} className="mt-4">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Create Your Own</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    Want to create your own historical social media post? Sign up or log in to get started!
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      className="w-full bg-gradient-to-r from-instagram-blue to-instagram-pink2 text-white"
                      onClick={() => router.push("/auth/signin?callbackUrl=/create")}
                    >
                      Create Post
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
