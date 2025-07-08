"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Settings, Calendar, MapPin, UserIcon } from "lucide-react"
import { PostFeed } from "@/components/dashboard/post-feed"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0,
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch user profile
        const userResponse = await fetch(`/api/users/${session?.user.id}`)
        const userData = await userResponse.json()
        setUser(userData.user)

        // Fetch user posts
        const postsResponse = await fetch(`/api/users/${session?.user.id}/posts`)
        const postsData = await postsResponse.json()
        setPosts(postsData.posts)

        // Set stats
        setStats({
          posts: postsData.posts.length,
          followers: userData.user._count?.followers || 0,
          following: userData.user._count?.following || 0,
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchProfile()
    }
  }, [session])

  if (status === "loading" || isLoading) {
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
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                <AvatarFallback className="text-2xl">{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h1 className="text-2xl font-bold">{user?.name}</h1>
                  <div className="text-gray-500 dark:text-gray-400">@{user?.username}</div>
                  <Button variant="outline" size="sm" onClick={() => router.push("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>

                <div className="flex justify-center md:justify-start gap-6 mb-4">
                  <div className="text-center">
                    <div className="font-bold">{stats.posts}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{stats.followers}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{stats.following}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {user?.bio && <p>{user.bio}</p>}

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      Joined {new Date(user?.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="mr-1 h-4 w-4" />
                      Historical Enthusiast
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      Digital Time Traveler
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="posts">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            {posts.length > 0 ? (
              <PostFeed posts={posts} />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't created any historical posts yet.</p>
                <Button onClick={() => router.push("/create")}>Create Your First Post</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-gray-500 dark:text-gray-400">
                We're working on this feature. Soon you'll be able to see all your favorite posts here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-gray-500 dark:text-gray-400">
                We're working on this feature. Soon you'll be able to see your activity history here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
