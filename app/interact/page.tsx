"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, RefreshCw, PlusCircle, Heart, MessageCircle, Share2 } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export default function InteractPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("instagram")
  const { toast } = useToast()
  const [commentText, setCommentText] = useState("")
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Use the public API endpoint that doesn't require authentication
      const response = await fetch(`/api/public/posts?platform=${activeTab}&limit=10`)

      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }

      const data = await response.json()
      setPosts(data.posts)
    } catch (error) {
      console.error("Error fetching posts:", error)
      setError("Failed to load posts. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [activeTab])

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like posts",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isLiked ? "DELETE" : "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to like/unlike post")
      }

      // Update the posts state to reflect the like/unlike
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            const newLikeCount = isLiked ? Number.parseInt(post.likes) - 1 : Number.parseInt(post.likes) + 1
            return {
              ...post,
              likes: newLikeCount.toString(),
              isLiked: !isLiked,
            }
          }
          return post
        }),
      )

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

  const handleComment = async (postId: string) => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to comment on posts",
        variant: "destructive",
      })
      return
    }

    if (!commentText.trim()) return

    setIsSubmittingComment(true)

    try {
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: commentText }),
      })

      if (!response.ok) {
        throw new Error("Failed to add comment")
      }

      const data = await response.json()

      // Update the posts state to reflect the new comment
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            const newCommentCount = Number.parseInt(post.comments) + 1
            return {
              ...post,
              comments: newCommentCount.toString(),
            }
          }
          return post
        }),
      )

      setCommentText("")
      setActiveCommentPostId(null)

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
      setIsSubmittingComment(false)
    }
  }

  const handleShare = (postId: string) => {
    const shareUrl = `${window.location.origin}/share/${postId}`
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Link Copied",
      description: "Post link copied to clipboard",
    })
  }

  // Card variants for animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    }),
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Social Feed</h1>
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={fetchPosts} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/create">
                <Button className="bg-gradient-to-r from-instagram-blue to-instagram-pink2 text-white">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Post
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        <Tabs defaultValue="instagram" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="twitter">X (Twitter)</TabsTrigger>
            <TabsTrigger value="reddit">Reddit</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-instagram-pink2" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">Error Loading Posts</h3>
                  <p className="text-red-500 dark:text-red-400 mb-6">{error}</p>
                  <Button onClick={fetchPosts}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              ) : posts.length > 0 ? (
                <motion.div className="max-w-xl mx-auto space-y-6" initial="hidden" animate="visible" exit="exit">
                  {posts.map((post, index) => (
                    <motion.div key={post.id} custom={index} variants={cardVariants}>
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        {/* Post header */}
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <Link href={`/profile/${post.user.id}`}>
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.username} />
                                <AvatarFallback>{post.username[0]}</AvatarFallback>
                              </Avatar>
                            </Link>
                            <div>
                              <Link href={`/profile/${post.user.id}`}>
                                <div className="font-semibold text-sm flex items-center">
                                  {post.username}
                                  {post.verified && (
                                    <span className="ml-1 text-blue-500">
                                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                      </svg>
                                    </span>
                                  )}
                                </div>
                              </Link>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {post.location || post.date}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/share/${post.id}`}>
                              <span>View</span>
                            </Link>
                          </Button>
                        </div>

                        {/* Post content */}
                        <div className="px-4 py-2">
                          <p className="text-sm mb-2">{post.content}</p>
                          {post.hashtags.length > 0 && (
                            <p className="text-sm text-blue-500 dark:text-blue-400">
                              {post.hashtags.map((tag: string, index: number) => (
                                <span key={index} className="inline-block mr-1">
                                  #{tag}{" "}
                                </span>
                              ))}
                            </p>
                          )}
                        </div>

                        {/* Post image */}
                        {post.imageUrl && (
                          <div className="aspect-square">
                            <img
                              src={post.imageUrl || "/placeholder.svg"}
                              alt="Post"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Post actions */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLike(post.id, post.isLiked)}
                                className="flex items-center text-gray-600 dark:text-gray-300"
                              >
                                <Heart className={`h-5 w-5 mr-1 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                                <span className="text-sm">{post.likes}</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                                className="flex items-center text-gray-600 dark:text-gray-300"
                              >
                                <MessageCircle className="h-5 w-5 mr-1" />
                                <span className="text-sm">{post.comments}</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleShare(post.id)}
                                className="flex items-center text-gray-600 dark:text-gray-300"
                              >
                                <Share2 className="h-5 w-5" />
                              </Button>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/share/${post.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>

                        {/* Comment section */}
                        {activeCommentPostId === post.id && (
                          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                                <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                              </Avatar>
                              <Input
                                placeholder="Add a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="flex-1"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleComment(post.id)}
                                disabled={isSubmittingComment || !commentText.trim()}
                              >
                                {isSubmittingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">There are no {activeTab} posts available yet.</p>
                  <Button onClick={fetchPosts}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              )}
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
