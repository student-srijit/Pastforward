"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SocialPost } from "@/components/social-post"
import { Loader2, PlusCircle, History, Compass, RefreshCw, AlertCircle, Globe } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const Dashboard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [publicPosts, setPublicPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPublic, setIsLoadingPublic] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [publicError, setPublicError] = useState<string | null>(null)
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("your-posts")

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("Dashboard: Fetching posts...")

      const response = await fetch("/api/posts?publicOnly=false")
      console.log("Dashboard: Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Dashboard: Failed to fetch posts:", response.status, errorText)
        setError(`Failed to fetch posts: ${response.status}`)
        setPosts([])
        return
      }

      const data = await response.json()
      console.log("Dashboard: API response data:", data)

      if (Array.isArray(data.posts)) {
        console.log("Dashboard: Setting posts state with", data.posts.length, "posts")
        setPosts(data.posts)
      } else {
        console.error("Dashboard: Invalid posts data format:", data)
        setError("Invalid data format received from server")
        setPosts([])
      }
    } catch (error) {
      console.error("Dashboard: Error fetching posts:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      setPosts([])
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPublicPosts = async () => {
    try {
      setIsLoadingPublic(true)
      setPublicError(null)
      console.log("Dashboard: Fetching public posts...")

      const response = await fetch("/api/posts?publicOnly=true")
      console.log("Dashboard: Public posts response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Dashboard: Failed to fetch public posts:", response.status, errorText)
        setPublicError(`Failed to fetch public posts: ${response.status}`)
        setPublicPosts([])
        return
      }

      const data = await response.json()
      console.log("Dashboard: Public posts API response data:", data)

      if (Array.isArray(data.posts)) {
        console.log("Dashboard: Setting public posts state with", data.posts.length, "posts")
        setPublicPosts(data.posts)
      } else {
        console.error("Dashboard: Invalid public posts data format:", data)
        setPublicError("Invalid data format received from server")
        setPublicPosts([])
      }
    } catch (error) {
      console.error("Dashboard: Error fetching public posts:", error)
      setPublicError(error instanceof Error ? error.message : "An unknown error occurred")
      setPublicPosts([])
    } finally {
      setIsLoadingPublic(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchPosts()
      fetchPublicPosts()
    } else {
      setIsLoading(false)
      setIsLoadingPublic(false)
    }
  }, [session])

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/auth/signin?callbackUrl=/dashboard")
    return null
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
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Welcome, {session?.user?.name || "Time Traveler"}!</h1>
          <p className="text-gray-400">Your journey through history begins here</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="your-posts">Your Posts</TabsTrigger>
            <TabsTrigger value="public-feed">Public Feed</TabsTrigger>
            <TabsTrigger value="explore">Explore</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="your-posts" key="your-posts">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Your Posts</h2>
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

                  {isLoading ? (
                    <Card>
                      <CardContent className="flex justify-center items-center py-12">
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                          <p className="text-gray-400">Loading your historical posts...</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : error ? (
                    <Card className="border-red-400 dark:border-red-700">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 mb-4">
                          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Error Loading Posts</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">{error}</p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button onClick={fetchPosts}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  ) : posts.length > 0 ? (
                    <motion.div className="space-y-6" initial="hidden" animate="visible" exit="exit">
                      {posts.map((post, index) => (
                        <motion.div key={post.id} custom={index} variants={cardVariants}>
                          <Link href={`/post/${post.id}`}>
                            <div className="transition-transform hover:scale-[1.01] relative">
                              {post.isPublic && (
                                <div className="absolute top-2 right-2 z-10 bg-green-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
                                  <Globe className="h-3 w-3 mr-1" />
                                  Public
                                </div>
                              )}
                              <SocialPost type={post.platform} post={post} />
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="rounded-full bg-gray-800 p-3 mb-4">
                          <History className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                        <p className="text-gray-400 text-center mb-6 max-w-md">
                          Start your historical journey by creating your first post or exploring content from different
                          eras.
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link href="/create">
                            <Button className="bg-gradient-to-r from-instagram-blue to-instagram-pink2 text-white">
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Create Your First Post
                            </Button>
                          </Link>
                        </motion.div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="mb-6 overflow-hidden">
                      <CardHeader>
                        <CardTitle>Your Profile</CardTitle>
                        <CardDescription>View and manage your historical personal</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden">
                            <motion.img
                              src={session?.user?.image || "/placeholder.svg?height=64&width=64&query=user"}
                              alt={session?.user?.name || "User"}
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.1 }}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{session?.user?.name}</h3>
                            <p className="text-gray-400 text-sm">Time Traveler</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                          <motion.div
                            className="bg-gray-800 p-2 rounded-lg"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(79, 70, 229, 0.1)" }}
                          >
                            <div className="font-bold">{posts.length}</div>
                            <div className="text-xs text-gray-400">Posts</div>
                          </motion.div>
                          <motion.div
                            className="bg-gray-800 p-2 rounded-lg"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(225, 48, 108, 0.1)" }}
                          >
                            <div className="font-bold">0</div>
                            <div className="text-xs text-gray-400">Followers</div>
                          </motion.div>
                          <motion.div
                            className="bg-gray-800 p-2 rounded-lg"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(253, 29, 29, 0.1)" }}
                          >
                            <div className="font-bold">0</div>
                            <div className="text-xs text-gray-400">Following</div>
                          </motion.div>
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Link href="/profile">
                            <Button variant="outline" className="w-full">
                              View Profile
                            </Button>
                          </Link>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Trending Eras</CardTitle>
                        <CardDescription>Popular historical periods</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {["Renaissance", "Ancient Egypt", "Victorian Era", "Medieval Europe", "Roman Empire"].map(
                            (era, index) => (
                              <motion.div
                                key={era}
                                className="flex items-center gap-2"
                                whileHover={{ x: 5, color: "#E1306C" }}
                              >
                                <div className="text-lg font-bold text-gray-500">{index + 1}</div>
                                <div className="text-sm">{era}</div>
                              </motion.div>
                            ),
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                          <Link href="/explore" className="w-full">
                            <Button variant="outline" size="sm" className="w-full">
                              <Compass className="mr-2 h-4 w-4" />
                              Explore All Eras
                            </Button>
                          </Link>
                        </motion.div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="public-feed" key="public-feed">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Public Feed</h2>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" onClick={fetchPublicPosts} disabled={isLoadingPublic}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingPublic ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </motion.div>
              </div>

              {isLoadingPublic ? (
                <Card>
                  <CardContent className="flex justify-center items-center py-12">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-gray-400">Loading public posts...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : publicError ? (
                <Card className="border-red-400 dark:border-red-700">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 mb-4">
                      <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Error Loading Public Posts</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center mb-6">{publicError}</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={fetchPublicPosts}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              ) : publicPosts.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {publicPosts.map((post, index) => (
                    <motion.div key={post.id} custom={index} variants={cardVariants}>
                      <Link href={`/share/${post.id}`}>
                        <div className="transition-transform hover:scale-[1.01]">
                          <SocialPost type={post.platform} post={post} />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-gray-800 p-3 mb-4">
                      <Globe className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No public posts yet</h3>
                    <p className="text-gray-400 text-center mb-6 max-w-md">
                      Be the first to share a historical post with the community!
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href="/create">
                        <Button className="bg-gradient-to-r from-instagram-blue to-instagram-pink2 text-white">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create a Post
                        </Button>
                      </Link>
                    </motion.div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="explore" key="explore">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Featured Historical Eras</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      id: "ancient-rome",
                      name: "Ancient Rome",
                      image: "/roman-forum-afternoon.png",
                      description: "Explore the mighty Roman Empire from its founding to its fall.",
                    },
                    {
                      id: "renaissance",
                      name: "Renaissance",
                      image: "/classical-allegory.png",
                      description: "Discover the rebirth of art, science, and culture in Europe.",
                    },
                    {
                      id: "industrial-revolution",
                      name: "Industrial Revolution",
                      image: "/industrial-era-factory.png",
                      description: "Witness the transformation of society through technological innovation.",
                    },
                  ].map((era, index) => (
                    <motion.div
                      key={era.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    >
                      <Card className="overflow-hidden h-full">
                        <div className="relative h-40">
                          <img
                            src={era.image || "/placeholder.svg"}
                            alt={era.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 p-4">
                            <h3 className="text-xl font-bold text-white">{era.name}</h3>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-400 mb-4">{era.description}</p>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link href={`/timeline?era=${era.id}`}>
                              <Button variant="outline" size="sm" className="w-full">
                                <Compass className="mr-2 h-4 w-4" />
                                Explore
                              </Button>
                            </Link>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
