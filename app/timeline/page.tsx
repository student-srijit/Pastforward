"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { SocialPost } from "@/components/social-post"
import { HistoricalContext } from "@/components/historical-context"

export default function TimelinePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeEra, setActiveEra] = useState("renaissance")

  // Sample timeline data
  const timelineData = {
    ancient: {
      name: "Ancient Civilizations",
      period: "3000 BCE - 500 CE",
      description: "The cradle of human civilization, from the rise of Mesopotamia to the fall of Rome.",
      posts: [
        {
          id: "ancient-1",
          platform: "twitter",
          username: "CleopatraVII",
          handle: "@LastPharaoh",
          avatar: "/powerful-pharaoh-queen.png",
          verified: true,
          date: "30 BCE",
          content:
            "Rome's politics are exhausting. Mark Antony and I are strategizing our next move. The future of Egypt hangs in the balance. #PtolemyDynasty #RomanPolitics",
          likes: "3.2K",
          retweets: "1.5K",
          replies: "428",
          hashtags: ["PtolemyDynasty", "RomanPolitics", "Alexandria"],
        },
      ],
    },
    medieval: {
      name: "Medieval Period",
      period: "500 CE - 1400 CE",
      description: "The Middle Ages, from the fall of Rome to the dawn of the Renaissance.",
      posts: [
        {
          id: "medieval-1",
          platform: "instagram",
          username: "EleanorOfAquitaine",
          avatar: "/regal-medieval-queen.png",
          verified: true,
          date: "1152 CE",
          location: "Poitiers, France",
          content:
            "Just annulled my marriage to Louis VII and now I'm marrying Henry of Anjou. Upgrading from King of France to future King of England. #RoyalWedding #PowerMoves",
          image: "/royal-wedding-procession.png",
          likes: "4.7K",
          comments: "892",
          hashtags: ["RoyalWedding", "PowerMoves", "MedievalPolitics"],
        },
      ],
    },
    renaissance: {
      name: "Renaissance",
      period: "1400 CE - 1600 CE",
      description: "A period of cultural rebirth and scientific revolution across Europe.",
      posts: [
        {
          id: "renaissance-1",
          platform: "instagram",
          username: "LeonardoDaVinci",
          avatar: "/renaissance-master.png",
          verified: true,
          date: "April 15, 1503",
          location: "Florence, Italy",
          content:
            "Just finished this portrait of a merchant's wife. I call it 'Mona Lisa'. Spent extra time on the smile, hope the client appreciates the subtlety. #ArtLife is challenging but rewarding.",
          image: "/enigmatic-portrait.png",
          likes: "9.8K",
          comments: "1.2K",
          hashtags: ["MonaLisa", "RenaissanceArt", "PortraitPainting", "ArtLife"],
        },
      ],
    },
    enlightenment: {
      name: "Enlightenment",
      period: "1600 CE - 1800 CE",
      description: "The Age of Reason, when science and intellectual interchange flourished.",
      posts: [
        {
          id: "enlightenment-1",
          platform: "twitter",
          username: "BenjaminFranklin",
          handle: "@BenFranklin",
          avatar: "/placeholder.svg?height=40&width=40&query=benjamin%20franklin",
          verified: true,
          date: "June 10, 1752",
          content:
            "Flying a kite in a thunderstorm today. For science, of course. Will report back if I survive. #Electricity #ScientificMethod #WhatCouldGoWrong",
          likes: "5.4K",
          retweets: "3.2K",
          replies: "782",
          hashtags: ["Electricity", "ScientificMethod", "WhatCouldGoWrong"],
        },
      ],
    },
    industrial: {
      name: "Industrial Revolution",
      period: "1760 CE - 1840 CE",
      description: "The transition to new manufacturing processes and a new social order.",
      posts: [
        {
          id: "industrial-1",
          platform: "reddit",
          username: "JamesWatt",
          avatar: "/placeholder.svg?height=40&width=40&query=james%20watt",
          subreddit: "r/IndustrialRevolution",
          date: "January 5, 1769",
          title: "Just patented a new steam engine design that's WAY more efficient",
          content:
            "After years of work, I've finally perfected my separate condenser design. This should make Newcomen's engine obsolete. My calculations show it's at least 3x more fuel efficient. This could revolutionize manufacturing and transportation. Looking for investors - any takers?",
          upvotes: "2.8K",
          comments: "342",
          awards: ["Gold", "Silver", "Helpful"],
        },
      ],
    },
    modern: {
      name: "Modern Era",
      period: "1840 CE - 1945 CE",
      description: "The age of rapid technological progress, global conflicts, and social change.",
      posts: [
        {
          id: "modern-1",
          platform: "twitter",
          username: "NikolaTesla",
          handle: "@RealTesla",
          avatar: "/placeholder.svg?height=40&width=40&query=nikola%20tesla",
          verified: true,
          date: "July 10, 1891",
          content:
            "Wireless power transmission is possible. I've demonstrated it. Edison calls it dangerous, but what does he know about AC? The future is wireless. #ACvsDC #WirelessPower #Innovation",
          likes: "7.3K",
          retweets: "4.1K",
          replies: "956",
          hashtags: ["ACvsDC", "WirelessPower", "Innovation"],
        },
      ],
    },
  }

  const eras = [
    { id: "ancient", name: "Ancient", color: "#D4B483" },
    { id: "medieval", name: "Medieval", color: "#7D8CC4" },
    { id: "renaissance", name: "Renaissance", color: "#A86464" },
    { id: "enlightenment", name: "Enlightenment", color: "#6B7D7D" },
    { id: "industrial", name: "Industrial", color: "#6BA292" },
    { id: "modern", name: "Modern", color: "#6B6BA2" },
  ]

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Interactive Historical Timeline</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore history through social media posts from different eras
          </p>
        </div>

        <div className="relative h-24 mb-12">
          {/* Timeline bar */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-700 transform -translate-y-1/2 rounded-full"></div>

          {/* Era markers */}
          <div className="absolute top-0 left-0 right-0 h-full flex justify-between">
            {eras.map((era, index) => (
              <div key={era.id} className="relative" style={{ left: `${(index / (eras.length - 1)) * 100}%` }}>
                <motion.button
                  className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setActiveEra(era.id)}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 ${activeEra === era.id ? "border-white" : "border-gray-500"}`}
                    style={{ backgroundColor: era.color }}
                  ></div>
                </motion.button>
                <div className="absolute top-full mt-2 transform -translate-x-1/2 text-sm font-medium">{era.name}</div>
              </div>
            ))}
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{timelineData[activeEra as keyof typeof timelineData].name}</CardTitle>
            <CardDescription>
              {timelineData[activeEra as keyof typeof timelineData].period} •{" "}
              {timelineData[activeEra as keyof typeof timelineData].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <HistoricalContext era={timelineData[activeEra as keyof typeof timelineData].name} />
              <Button onClick={() => router.push(`/create?era=${activeEra}`)}>Create Post in This Era</Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="posts">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="events">Key Events</TabsTrigger>
            <TabsTrigger value="figures">Historical Figures</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {timelineData[activeEra as keyof typeof timelineData].posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <SocialPost type={post.platform as "instagram" | "twitter" | "reddit"} post={post} />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-gray-500 dark:text-gray-400">
                We're working on adding key historical events for each era.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="figures">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-gray-500 dark:text-gray-400">
                We're working on adding notable historical figures for each era.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
