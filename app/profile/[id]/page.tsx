"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Settings, Calendar, UserPlus, UserCheck, Pencil } from "lucide-react"
import { PostFeed } from "@/components/dashboard/post-feed"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0,
  })

  const isOwnProfile = session?.user?.id === params.id

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)

        // Fetch user profile
        const userResponse = await fetch(`/api/users/${params.id}`)

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user profile")
        }

        const userData = await userResponse.json()
        setUser(userData.user)

        // Fetch user posts
        const postsResponse = await fetch(`/api/users/${params.id}/posts`)

        if (!postsResponse.ok) {
          throw new Error("Failed to fetch user posts")
        }

        const postsData = await postsResponse.json()
        setPosts(postsData.posts)

        // Set stats
        setStats({
          posts: userData.user._count?.posts || 0,
          followers: userData.user._count?.followers || 0,
          following: userData.user._count?.following || 0,
        })

        // Check if current user is following this profile
        if (session && !isOwnProfile) {
          const followResponse = await fetch(`/api/users/follow/check?userId=${params.id}`)

          if (followResponse.ok) {
            const followData = await followResponse.json()
            setIsFollowing(followData.isFollowing)
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [params.id, session, toast, isOwnProfile])

  const handleFollow = async () => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow users",
        variant: "destructive",
      })
      router.push(`/auth/signin?callbackUrl=/profile/${params.id}`)
      return
    }

    setIsFollowLoading(true)

    try {
      const method = isFollowing ? "DELETE" : "POST"

      const response = await fetch(`/api/users/follow`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: params.id }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isFollowing ? "unfollow" : "follow"} user`)
      }

      setIsFollowing(!isFollowing)

      // Update follower count
      setStats((prev) => ({
        ...prev,
        followers: isFollowing ? prev.followers - 1 : prev.followers + 1,
      }))

      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing ? "You are no longer following this user" : "You are now following this user",
      })
    } catch (error) {
      console.error("Error following/unfollowing user:", error)
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsFollowLoading(false)
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

  if (!user) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">User Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The user you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
          </div>
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
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Avatar className="h-24 w-24 md:h-32 md:w-32">
                  <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                  <AvatarFallback className="text-2xl">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </motion.div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h1 className="text-2xl font-bold">{user?.name}</h1>
                  <div className="text-gray-500 dark:text-gray-400">@{user?.username}</div>

                  {isOwnProfile ? (
                    <Button variant="outline" size="sm" onClick={() => router.push("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <Button
                      variant={isFollowing ? "outline" : "default"}
                      size="sm"
                      onClick={handleFollow}
                      disabled={isFollowLoading}
                    >
                      {isFollowLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : isFollowing ? (
                        <>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Follow
                        </>
                      )}
                    </Button>
                  )}
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
                      Joined {formatDistanceToNow(new Date(user?.createdAt), { addSuffix: true })}
                    </div>
                    {isOwnProfile && (
                      <Button variant="ghost" size="sm" onClick={() => router.push("/settings")}>
                        <Pencil className="mr-1 h-4 w-4" />
                        Edit Bio
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="posts">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            {posts.length > 0 ? (
              <PostFeed posts={posts} />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {isOwnProfile
                    ? "You haven't created any historical posts yet."
                    : `${user.name} hasn't created any historical posts yet.`}
                </p>
                {isOwnProfile && <Button onClick={() => router.push("/create")}>Create Your First Post</Button>}
              </div>
            )}
          </TabsContent>

          <TabsContent value="followers">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-gray-500 dark:text-gray-400">
                We're working on this feature. Soon you'll be able to see all followers here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="following">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-gray-500 dark:text-gray-400">
                We're working on this feature. Soon you'll be able to see all accounts this user follows.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
