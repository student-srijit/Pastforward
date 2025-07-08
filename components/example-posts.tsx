"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SocialPost } from "@/components/social-post"

export function ExamplePosts() {
  const ref = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("instagram")

  const examplePosts = {
    instagram: [
      {
        username: "MahatmaGandhi",
        avatar: "/gandhi-spinning-wheel.png",
        verified: true,
        date: "August 15, 1947",
        location: "Delhi, India",
        content:
          "At the stroke of the midnight hour, when the world sleeps, India will awake to life and freedom. A moment comes, which comes but rarely in history, when we step out from the old to the new.",
        image: "/tricolor-unity.png",
        likes: "2.4M",
        comments: "456K",
        hashtags: ["FreedomAtMidnight", "IndianIndependence", "NewBeginnings"],
      },
      {
        username: "LeonardoDaVinci",
        avatar: "/renaissance-master.png",
        verified: true,
        date: "April 15, 1503",
        location: "Florence, Italy",
        content:
          "Just finished this portrait of a merchant's wife. I call it 'Mona Lisa'. Spent extra time on the smile, hope the client appreciates the subtlety. #ArtLife is challenging but rewarding.",
        image: "/enigmatic-portrait.png",
        likes: "1.2M",
        comments: "325K",
        hashtags: ["MonaLisa", "RenaissanceArt", "PortraitPainting", "ArtLife"],
      },
    ],
    twitter: [
      {
        username: "WilliamShakespeare",
        avatar: "/bard-at-work.png",
        verified: true,
        handle: "@TheRealBard",
        date: "July 7, 1601",
        content:
          "To tweet, or not to tweet, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous followers, Or to take arms against a sea of trolls.",
        likes: "53.2K",
        retweets: "42.1K",
        replies: "12.3K",
        hashtags: ["Hamlet", "QuillThoughts", "GlobeTheater"],
      },
      {
        username: "Marie Curie",
        avatar: "/placeholder.svg?height=40&width=40&query=marie%20curie",
        verified: true,
        handle: "@MmeCurie",
        date: "December 10, 1911",
        content:
          "Just won my second Nobel Prize! This time in Chemistry. First person ever to win in multiple scientific fields. And they said women couldn't do science! #WomenInSTEM #NobelPrize",
        likes: "103K",
        retweets: "87.5K",
        replies: "23.1K",
        hashtags: ["WomenInSTEM", "NobelPrize", "Radioactivity", "BreakingBarriers"],
      },
    ],
    reddit: [
      {
        username: "CleopatraVII",
        avatar: "/placeholder.svg?height=40&width=40&query=cleopatra",
        subreddit: "r/AncientPolitics",
        date: "August 12, 30 BCE",
        title: "TIFU by trusting Marc Antony with my military strategy against Octavian",
        content:
          "Long story short, we lost the Battle of Actium because SOMEONE (looking at you Marc) insisted on a naval battle when our strength was on land. Now Rome is at my doorstep, and I'm running out of options. Any advice for dealing with Octavian? I hear he's not as forgiving as his uncle Julius was.",
        upvotes: "15.7K",
        comments: "3.2K",
        awards: ["Gold", "Silver", "Helpful"],
      },
      {
        username: "NikolaTesla",
        avatar: "/placeholder.svg?height=40&width=40&query=nikola%20tesla",
        subreddit: "r/ElectricalEngineering",
        date: "July 10, 1891",
        title: "I've invented wireless power transmission, but Edison is spreading FUD. How do I get funding?",
        content:
          "I've successfully demonstrated that electricity can be transmitted wirelessly through the air. This could revolutionize how we power our homes and devices. However, Edison and his DC current supporters are telling investors it's 'dangerous' and 'impractical.' Any advice on securing funding when powerful competitors are actively working against you?",
        upvotes: "22.3K",
        comments: "4.8K",
        awards: ["Platinum", "Gold", "Helpful", "Wholesome"],
      },
    ],
  }

  return (
    <section id="examples" className="py-20 bg-gray-950 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="text-gradient">Example Posts</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            See how historical figures might have used social media
          </motion.p>
        </div>

        <div ref={ref} className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8 gap-2 overflow-x-auto pb-2"
          >
            <Button
              variant={activeTab === "instagram" ? "default" : "outline"}
              className={
                activeTab === "instagram"
                  ? "instagram-gradient-btn text-white"
                  : "border-instagram-pink2 text-instagram-pink2"
              }
              onClick={() => setActiveTab("instagram")}
            >
              Instagram
            </Button>
            <Button
              variant={activeTab === "twitter" ? "default" : "outline"}
              className={
                activeTab === "twitter"
                  ? "bg-instagram-blue hover:bg-instagram-blue/90 text-white"
                  : "border-instagram-blue text-instagram-blue"
              }
              onClick={() => setActiveTab("twitter")}
            >
              X (Twitter)
            </Button>
            <Button
              variant={activeTab === "reddit" ? "default" : "outline"}
              className={
                activeTab === "reddit"
                  ? "bg-instagram-red hover:bg-instagram-red/90 text-white"
                  : "border-instagram-red text-instagram-red"
              }
              onClick={() => setActiveTab("reddit")}
            >
              Reddit
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeTab === "instagram" &&
              examplePosts.instagram.map((post, index) => (
                <motion.div
                  key={`instagram-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <SocialPost type="instagram" post={post} />
                </motion.div>
              ))}

            {activeTab === "twitter" &&
              examplePosts.twitter.map((post, index) => (
                <motion.div
                  key={`twitter-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <SocialPost type="twitter" post={post} />
                </motion.div>
              ))}

            {activeTab === "reddit" &&
              examplePosts.reddit.map((post, index) => (
                <motion.div
                  key={`reddit-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <SocialPost type="reddit" post={post} />
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
