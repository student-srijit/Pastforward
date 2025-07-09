"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Search, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ExplorePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Sample data for trending hashtags, eras, and users
  const trendingHashtags = [
    { name: "RenaissanceArt", count: 1243 },
    { name: "AncientEgypt", count: 987 },
    { name: "VictorianEra", count: 856 },
    { name: "MedievalLife", count: 742 },
    { name: "RomanEmpire", count: 698 },
    { name: "IndustrialRevolution", count: 654 },
    { name: "WorldWarII", count: 621 },
    { name: "AncientGreece", count: 589 },
    { name: "ColdWar", count: 543 },
    { name: "FrenchRevolution", count: 512 },
  ]

  const popularEras = [
    {
      id: "renaissance",
      name: "Renaissance",
      posts: 3245,
      image: "/placeholder.svg?height=200&width=200&query=renaissance%20art",
    },
    {
      id: "ancient-egypt",
      name: "Ancient Egypt",
      posts: 2876,
      image: "/placeholder.svg?height=200&width=200&query=ancient%20egypt",
    },
    {
      id: "roman-empire",
      name: "Roman Empire",
      posts: 2543,
      image: "/placeholder.svg?height=200&width=200&query=roman%20empire",
    },
    {
      id: "victorian",
      name: "Victorian Era",
      posts: 2187,
      image: "/placeholder.svg?height=200&width=200&query=victorian%20era",
    },
    {
      id: "medieval",
      name: "Medieval Europe",
      posts: 1965,
      image: "/placeholder.svg?height=200&width=200&query=medieval%20castle",
    },
    {
      id: "world-war-2",
      name: "World War II",
      posts: 1876,
      image: "/placeholder.svg?height=200&width=200&query=world%20war%202",
    },
  ]

  const suggestedUsers = [
    {
      id: "user1",
      name: "History Buff",
      username: "historybuff",
      image: "/placeholder.svg?height=40&width=40&query=historian",
      followers: 1243,
      posts: 87,
    },
    {
      id: "user2",
      name: "Time Traveler",
      username: "timetraveler",
      image: "/placeholder.svg?height=40&width=40&query=time%20traveler",
      followers: 987,
      posts: 65,
    },
    {
      id: "user3",
      name: "Ancient Explorer",
      username: "ancientexplorer",
      image: "/placeholder.svg?height=40&width=40&query=explorer",
      followers: 856,
      posts: 54,
    },
    {
      id: "user4",
      name: "Renaissance Artist",
      username: "renaissanceartist",
      image: "/placeholder.svg?height=40&width=40&query=artist",
      followers: 742,
      posts: 43,
    },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }, 500)
  }

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Explore History</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">Discover historical content, eras, and users</p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="Search historical posts, eras, or users..."
                className="pl-10 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                disabled={isLoading || !searchQuery.trim()}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </div>
          </form>
        </div>

        <Tabs defaultValue="trending">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="eras">Historical Eras</TabsTrigger>
            <TabsTrigger value="users">Suggested Users</TabsTrigger>
          </TabsList>

          <TabsContent value="trending">
            <h2 className="text-2xl font-bold mb-6">Trending Hashtags</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {trendingHashtags.map((hashtag, index) => (
                <motion.div
                  key={hashtag.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link href={`/search?q=%23${hashtag.name}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="font-semibold text-lg mb-1">#{hashtag.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{hashtag.count} posts</div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="eras">
            <h2 className="text-2xl font-bold mb-6">Popular Historical Eras</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularEras.map((era, index) => (
                <motion.div
                  key={era.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link href={`/timeline?era=${era.id}`}>
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-40">
                        <img
                          src={era.image || "/placeholder.svg"}
                          alt={era.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                          <h3 className="text-xl font-bold text-white">{era.name}</h3>
                          <p className="text-sm text-gray-300">{era.posts} posts</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <h2 className="text-2xl font-bold mb-6">Suggested Users to Follow</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={user.image || "/placeholder.svg"}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                        </div>
                        <Button size="sm">Follow</Button>
                      </div>
                      <div className="flex justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <div>{user.followers} followers</div>
                        <div>{user.posts} posts</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
