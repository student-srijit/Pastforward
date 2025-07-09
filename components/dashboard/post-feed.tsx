"use client"

import { useState } from "react"
import Link from "next/link"
import { SocialPost } from "@/components/social-post"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

interface Post {
  id: string
  platform: string
  username: string
  avatar: string
  verified?: boolean
  date: string
  location?: string
  content: string
  image?: string
  likes: string
  comments: string
  hashtags: string[]
  handle?: string
  retweets?: string
  replies?: string
  subreddit?: string
  title?: string
  upvotes?: string
  awards?: string[]
  userId: string
  user: {
    name: string
    image: string
  }
  era: string
}

interface PostFeedProps {
  posts: Post[]
}

export function PostFeed({ posts }: PostFeedProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [currentPosts, setCurrentPosts] = useState(posts)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadMorePosts = async () => {
    if (!hasMore) return

    setIsLoading(true)
    try {
      // In a real app, you would fetch more posts from the API
      // For now, we'll simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // If there are no more posts to load
      if (page >= 3) {
        setHasMore(false)
      } else {
        // Simulate loading more posts
        setPage((prev) => prev + 1)
        // In a real app, you would append the new posts to the current posts
      }
    } catch (error) {
      console.error("Error loading more posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterPosts = (tab: string) => {
    setActiveTab(tab)

    if (tab === "all") {
      setCurrentPosts(posts)
    } else {
      setCurrentPosts(posts.filter((post) => post.platform === tab))
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all" onClick={() => filterPosts("all")}>
            All
          </TabsTrigger>
          <TabsTrigger value="instagram" onClick={() => filterPosts("instagram")}>
            Instagram
          </TabsTrigger>
          <TabsTrigger value="twitter" onClick={() => filterPosts("twitter")}>
            X (Twitter)
          </TabsTrigger>
          <TabsTrigger value="reddit" onClick={() => filterPosts("reddit")}>
            Reddit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {currentPosts.map((post) => (
            <Link href={`/post/${post.id}`} key={post.id}>
              <div className="transition-transform hover:scale-[1.01]">
                <SocialPost type={post.platform as "instagram" | "twitter" | "reddit"} post={post} />
              </div>
            </Link>
          ))}
        </TabsContent>

        <TabsContent value="instagram" className="space-y-6">
          {currentPosts.map((post) => (
            <Link href={`/post/${post.id}`} key={post.id}>
              <div className="transition-transform hover:scale-[1.01]">
                <SocialPost type="instagram" post={post} />
              </div>
            </Link>
          ))}
        </TabsContent>

        <TabsContent value="twitter" className="space-y-6">
          {currentPosts.map((post) => (
            <Link href={`/post/${post.id}`} key={post.id}>
              <div className="transition-transform hover:scale-[1.01]">
                <SocialPost type="twitter" post={post} />
              </div>
            </Link>
          ))}
        </TabsContent>

        <TabsContent value="reddit" className="space-y-6">
          {currentPosts.map((post) => (
            <Link href={`/post/${post.id}`} key={post.id}>
              <div className="transition-transform hover:scale-[1.01]">
                <SocialPost type="reddit" post={post} />
              </div>
            </Link>
          ))}
        </TabsContent>
      </Tabs>

      {currentPosts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No posts found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {activeTab === "all"
              ? "There are no posts to display yet."
              : `There are no ${activeTab} posts to display yet.`}
          </p>
        </div>
      )}

      {currentPosts.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={loadMorePosts}
            disabled={isLoading || !hasMore}
            variant="outline"
            className="w-full max-w-md"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : hasMore ? (
              "Load More"
            ) : (
              "No More Posts"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
