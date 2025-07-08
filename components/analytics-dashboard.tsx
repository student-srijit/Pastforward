"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, Globe, Eye, Heart, MessageSquare, Share, Zap, Target } from "lucide-react"

interface MetricData {
  label: string
  value: number
  change: number
  trend: "up" | "down" | "stable"
}

interface ActivityEvent {
  id: string
  type: "view" | "like" | "share" | "comment"
  content: string
  timestamp: string
  location: string
}

export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityEvent[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Initialize metrics
    const initialMetrics: MetricData[] = [
      { label: "Total Views", value: 45623, change: 12.5, trend: "up" },
      { label: "Engagement Rate", value: 8.7, change: 2.3, trend: "up" },
      { label: "Active Users", value: 12847, change: -1.2, trend: "down" },
      { label: "Global Reach", value: 47, change: 5.8, trend: "up" },
    ]
    setMetrics(initialMetrics)

    // Initialize activity
    const initialActivity: ActivityEvent[] = [
      {
        id: "1",
        type: "view",
        content: "Napoleon Bonaparte post viewed",
        timestamp: "2 min ago",
        location: "France",
      },
      {
        id: "2",
        type: "like",
        content: "Ancient Rome timeline liked",
        timestamp: "5 min ago",
        location: "Italy",
      },
      {
        id: "3",
        type: "share",
        content: "World War II post shared",
        timestamp: "8 min ago",
        location: "Germany",
      },
    ]
    setRecentActivity(initialActivity)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    if (!isClient) return

    const interval = setInterval(() => {
      // Update metrics with small random changes
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: metric.label.includes("Rate")
            ? Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 0.5))
            : Math.max(0, metric.value + Math.floor((Math.random() - 0.5) * 10)),
          change: (Math.random() - 0.5) * 5,
          trend: Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "down" : "stable",
        })),
      )

      // Add new activity events
      if (Math.random() > 0.7) {
        const activities = [
          "Medieval History post viewed",
          "Renaissance timeline liked",
          "Ancient Egypt post shared",
          "Greek Philosophy comment added",
          "Roman Empire post bookmarked",
        ]

        const locations = ["USA", "UK", "France", "Germany", "Italy", "Spain", "Japan", "Brazil"]
        const types: ("view" | "like" | "share" | "comment")[] = ["view", "like", "share", "comment"]

        setRecentActivity((prev) => [
          {
            id: Date.now().toString(),
            type: types[Math.floor(Math.random() * types.length)],
            content: activities[Math.floor(Math.random() * activities.length)],
            timestamp: "just now",
            location: locations[Math.floor(Math.random() * locations.length)],
          },
          ...prev.slice(0, 9),
        ])
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isClient])

  if (!isClient) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Advanced
              </span>{" "}
              <span className="text-white">Analytics</span>
            </h2>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-white border-white/20 mb-6">
              <BarChart3 className="w-4 h-4 mr-2" />
              Real-time Data
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Advanced
              </span>{" "}
              <span className="text-white">Analytics</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Track performance, engagement, and global reach with AI-powered insights
            </p>
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-r ${
                        index === 0
                          ? "from-blue-500 to-cyan-500"
                          : index === 1
                            ? "from-green-500 to-emerald-500"
                            : index === 2
                              ? "from-purple-500 to-pink-500"
                              : "from-yellow-500 to-orange-500"
                      } flex items-center justify-center`}
                    >
                      {index === 0 ? (
                        <Eye className="w-5 h-5 text-white" />
                      ) : index === 1 ? (
                        <Heart className="w-5 h-5 text-white" />
                      ) : index === 2 ? (
                        <Users className="w-5 h-5 text-white" />
                      ) : (
                        <Globe className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        metric.trend === "up"
                          ? "border-green-500/30 text-green-400"
                          : metric.trend === "down"
                            ? "border-red-500/30 text-red-400"
                            : "border-gray-500/30 text-gray-400"
                      }`}
                    >
                      <TrendingUp className={`w-3 h-3 mr-1 ${metric.trend === "down" ? "rotate-180" : ""}`} />
                      {Math.abs(metric.change).toFixed(1)}%
                    </Badge>
                  </div>
                  <h3 className="text-white/60 text-sm mb-1">{metric.label}</h3>
                  <p className="text-white text-2xl font-bold">
                    {metric.label.includes("Rate") ? `${metric.value.toFixed(1)}%` : metric.value.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Real-time Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Live Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-80 overflow-y-auto">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === "view"
                          ? "bg-blue-500/20"
                          : activity.type === "like"
                            ? "bg-red-500/20"
                            : activity.type === "share"
                              ? "bg-green-500/20"
                              : "bg-purple-500/20"
                      }`}
                    >
                      {activity.type === "view" ? (
                        <Eye className="w-4 h-4 text-blue-400" />
                      ) : activity.type === "like" ? (
                        <Heart className="w-4 h-4 text-red-400" />
                      ) : activity.type === "share" ? (
                        <Share className="w-4 h-4 text-green-400" />
                      ) : (
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.content}</p>
                      <div className="flex items-center space-x-2 text-xs text-white/60">
                        <span>{activity.timestamp}</span>
                        <span>•</span>
                        <span>{activity.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-orange-400" />
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    label: "Content Performance",
                    value: 87,
                    insight: "Historical posts perform 23% better",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    label: "Audience Engagement",
                    value: 92,
                    insight: "Peak activity at 2-4 PM EST",
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    label: "Global Reach",
                    value: 78,
                    insight: "Strong growth in European markets",
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    label: "AI Accuracy",
                    value: 95,
                    insight: "Historical facts verified at 95% accuracy",
                    color: "from-yellow-500 to-orange-500",
                  },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm font-medium">{item.label}</span>
                      <span className="text-white/60 text-sm">{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                    <p className="text-white/60 text-xs">{item.insight}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
