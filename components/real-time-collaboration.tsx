"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageSquare, Edit3, Eye, Wifi, Clock, CheckCircle, AlertCircle, User } from "lucide-react"

interface CollaborationUser {
  id: string
  name: string
  avatar: string
  status: "online" | "editing" | "viewing"
  lastSeen: string
  cursor?: { x: number; y: number }
}

interface Activity {
  id: string
  user: string
  action: string
  timestamp: string
  type: "edit" | "comment" | "join" | "leave"
}

export function RealTimeCollaboration() {
  const [users, setUsers] = useState<CollaborationUser[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("connected")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Initialize mock users
    const initialUsers: CollaborationUser[] = [
      {
        id: "1",
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "editing",
        lastSeen: "now",
      },
      {
        id: "2",
        name: "Marcus Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "viewing",
        lastSeen: "2 min ago",
      },
      {
        id: "3",
        name: "Elena Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "online",
        lastSeen: "5 min ago",
      },
    ]
    setUsers(initialUsers)

    // Initialize activities
    const initialActivities: Activity[] = [
      {
        id: "1",
        user: "Sarah Chen",
        action: "edited the Napoleon section",
        timestamp: "2 minutes ago",
        type: "edit",
      },
      {
        id: "2",
        user: "Marcus Johnson",
        action: "added a comment on French Revolution",
        timestamp: "5 minutes ago",
        type: "comment",
      },
      {
        id: "3",
        user: "Elena Rodriguez",
        action: "joined the collaboration",
        timestamp: "8 minutes ago",
        type: "join",
      },
    ]
    setActivities(initialActivities)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    if (!isClient) return

    const interval = setInterval(() => {
      // Simulate user activity changes
      setUsers((prev) =>
        prev.map((user) => ({
          ...user,
          status:
            Math.random() > 0.7
              ? (["online", "editing", "viewing"] as const)[Math.floor(Math.random() * 3)]
              : user.status,
        })),
      )

      // Add new activities occasionally
      if (Math.random() > 0.8) {
        const actions = [
          "updated the timeline",
          "added historical context",
          "corrected a date",
          "added a new source",
          "improved the description",
        ]

        const userNames = ["Sarah Chen", "Marcus Johnson", "Elena Rodriguez"]

        setActivities((prev) => [
          {
            id: Date.now().toString(),
            user: userNames[Math.floor(Math.random() * userNames.length)],
            action: actions[Math.floor(Math.random() * actions.length)],
            timestamp: "just now",
            type: "edit",
          },
          ...prev.slice(0, 9),
        ])
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isClient])

  if (!isClient) {
    return (
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Real-time
              </span>{" "}
              <span className="text-white">Collaboration</span>
            </h2>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border-white/20 mb-6">
              <Wifi className="w-4 h-4 mr-2" />
              Live WebSocket Connection
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Real-time
              </span>{" "}
              <span className="text-white">Collaboration</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Work together seamlessly with live editing, instant comments, and presence awareness
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Users */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-400" />
                  Active Users ({users.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${
                            user.status === "editing"
                              ? "bg-green-500"
                              : user.status === "viewing"
                                ? "bg-blue-500"
                                : "bg-gray-500"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{user.name}</p>
                        <p className="text-white/60 text-xs">{user.lastSeen}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs border-white/20 ${
                        user.status === "editing"
                          ? "text-green-400"
                          : user.status === "viewing"
                            ? "text-blue-400"
                            : "text-white/60"
                      }`}
                    >
                      {user.status === "editing" ? (
                        <Edit3 className="w-3 h-3 mr-1" />
                      ) : user.status === "viewing" ? (
                        <Eye className="w-3 h-3 mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {user.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Live Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                  Live Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-80 overflow-y-auto">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === "edit"
                          ? "bg-green-500"
                          : activity.type === "comment"
                            ? "bg-blue-500"
                            : activity.type === "join"
                              ? "bg-purple-500"
                              : "bg-red-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-white/60 text-xs">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Connection Status & Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Connection Status */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Wifi className="w-5 h-5 mr-2 text-green-400" />
                  Connection Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-white">Connected</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">&lt; 50ms latency</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Collaboration Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: CheckCircle, text: "Live cursor tracking", status: "active" },
                  { icon: CheckCircle, text: "Real-time editing", status: "active" },
                  { icon: CheckCircle, text: "Instant comments", status: "active" },
                  { icon: CheckCircle, text: "Presence awareness", status: "active" },
                  { icon: AlertCircle, text: "Voice chat", status: "coming" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <feature.icon
                      className={`w-4 h-4 ${feature.status === "active" ? "text-green-400" : "text-yellow-400"}`}
                    />
                    <span className="text-white/80 text-sm">{feature.text}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        feature.status === "active"
                          ? "border-green-500/30 text-green-400"
                          : "border-yellow-500/30 text-yellow-400"
                      }`}
                    >
                      {feature.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Demo Button */}
            <Button className="cursor-pointer w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white py-3 rounded-xl">
              <Users className="w-5 h-5 mr-2" />
              Join Collaboration
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
