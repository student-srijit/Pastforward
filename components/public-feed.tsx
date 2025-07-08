"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SocialPost } from "@/components/social-post"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function PublicFeed() {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { toast } = useToast()

  // For infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.5 },
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [loadMoreRef])

  const fetchPosts = async (reset = false) => {
    try {
      setError(null)
      if (reset) {
        setIsLoading(true)
        setPage(1)
      }

      const currentPage = reset ? 1 : page
      const platform = activeTab !== "all" ? activeTab : ""

      // Use the public API endpoint that doesn't require authentication
      const response = await fetch(
        `/api/public/posts?page=${currentPage}&limit=6${platform ? `&platform=${platform}` : ""}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }

      const data = await response.json()

      if (reset) {
        setPosts(data.posts || [])
      } else {
        setPosts((prev) => [...prev, ...(data.posts || [])])
      }

      setHasMore(data.pagination?.page < data.pagination?.pages)
      if (!reset) setPage((prev) => prev + 1)
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

  // Initial fetch
  useEffect(() => {
    fetchPosts(true)
  }, [activeTab])

  // Infinite scroll
  useEffect(() => {
    if (isInView && !isLoading && hasMore) {
      fetchPosts()
    }
  }, [isInView, isLoading, hasMore])

  // Filter posts by platform
  const handleTabChange = (value: string) => {
    setActiveTab(value)
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

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-instagram-pink2" />
      </div>
    )
  }

  if (error && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">Error Loading Posts</h3>
        <p className="text-red-500 dark:text-red-400 mb-6">{error}</p>
        <Button onClick={() => fetchPosts(true)}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
          <TabsTrigger value="twitter">X (Twitter)</TabsTrigger>
          <TabsTrigger value="reddit">Reddit</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value={activeTab} className="mt-0">
            {posts.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {posts.map((post, index) => (
                  <motion.div key={post.id || index} custom={index} variants={cardVariants} className="group">
                    <Link href={`/share/${post.id}`}>
                      <div className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl rounded-lg overflow-hidden">
                        <SocialPost type={post.platform} post={post} />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {activeTab === "all"
                    ? "There are no public posts available yet."
                    : `There are no public ${activeTab} posts available yet.`}
                </p>
                <Button onClick={() => fetchPosts(true)}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            )}

            {/* Load more trigger for infinite scroll */}
            {hasMore && !isLoading && (
              <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            )}

            {isLoading && posts.length > 0 && (
              <div className="flex justify-center mt-8">
                <Loader2 className="h-8 w-8 animate-spin text-instagram-pink2" />
              </div>
            )}

            {!hasMore && posts.length > 0 && (
              <div className="text-center mt-8 text-gray-500 dark:text-gray-400">
                You've reached the end of the feed
              </div>
            )}
          </TabsContent>
        </AnimatePresence>
      </Tabs>

      <div className="flex justify-center mt-8">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/auth/signup">
            <Button className="bg-gradient-to-r from-instagram-blue to-instagram-pink2 text-white hover:shadow-lg hover:shadow-instagram-pink2/20 transition-all duration-300">
              Sign Up to Create Your Own Posts
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
