"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2, ArrowUp, Award } from "lucide-react"
import { motion } from "framer-motion"

type SocialPostProps = {
  type: "instagram" | "twitter" | "reddit"
  post: any
}

export function SocialPost({ type, post }: SocialPostProps) {
  const [isLikeHovered, setIsLikeHovered] = useState(false)

  // Ensure post is not undefined and has required properties
  if (!post) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
        <p className="text-gray-400">Post data unavailable</p>
      </div>
    )
  }

  // Common post data with fallbacks
  const username = post.username || "Historical User"
  const avatar = post.avatar || "/placeholder.svg?height=40&width=40"
  const date = post.date || "Historical Date"
  const content = post.content || ""
  const hashtags = Array.isArray(post.hashtags) ? post.hashtags : []

  // Instagram post
  if (type === "instagram") {
    return (
      <motion.div
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
        whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center p-4">
          <motion.div className="h-10 w-10 rounded-full overflow-hidden mr-3" whileHover={{ scale: 1.1 }}>
            <img src={avatar || "/placeholder.svg"} alt={username} className="h-full w-full object-cover" />
          </motion.div>
          <div>
            <div className="flex items-center">
              <span className="font-semibold text-sm">{username}</span>
              {post.verified && (
                <motion.span
                  className="ml-1 text-blue-500"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </motion.span>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{post.location || date}</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-2">
          <p className="text-sm mb-2">{content}</p>
          {hashtags.length > 0 && (
            <p className="text-sm text-blue-500 dark:text-blue-400">
              {hashtags.map((tag: string, index: number) => (
                <motion.span key={index} className="inline-block mr-1" whileHover={{ scale: 1.1, color: "#E1306C" }}>
                  #{tag}{" "}
                </motion.span>
              ))}
            </p>
          )}
        </div>

        {/* Image */}
        {post.image && (
          <div className="aspect-square">
            <img src={post.image || "/placeholder.svg"} alt="Post" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                className="flex items-center text-gray-600 dark:text-gray-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onHoverStart={() => setIsLikeHovered(true)}
                onHoverEnd={() => setIsLikeHovered(false)}
              >
                <motion.div
                  animate={isLikeHovered ? { scale: [1, 1.2, 0.9, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Heart className="h-5 w-5 mr-1" />
                </motion.div>
                <span className="text-sm">{post.likes || "0"}</span>
              </motion.button>
              <motion.button
                className="flex items-center text-gray-600 dark:text-gray-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MessageCircle className="h-5 w-5 mr-1" />
                <span className="text-sm">{post.comments || "0"}</span>
              </motion.button>
              <motion.button
                className="flex items-center text-gray-600 dark:text-gray-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Twitter post
  if (type === "twitter") {
    return (
      <motion.div
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
        whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex">
          <motion.div className="h-10 w-10 rounded-full overflow-hidden mr-3" whileHover={{ scale: 1.1 }}>
            <img src={avatar || "/placeholder.svg"} alt={username} className="h-full w-full object-cover" />
          </motion.div>
          <div>
            <div className="flex items-center">
              <span className="font-semibold text-sm">{username}</span>
              {post.verified && (
                <motion.span
                  className="ml-1 text-blue-500"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </motion.span>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{post.handle || ""}</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{date}</span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-2">
          <p className="text-sm">{content}</p>
          {hashtags.length > 0 && (
            <p className="text-sm text-blue-500 dark:text-blue-400 mt-1">
              {hashtags.map((tag: string, index: number) => (
                <motion.span key={index} className="inline-block mr-1" whileHover={{ scale: 1.1, color: "#1DA1F2" }}>
                  #{tag}{" "}
                </motion.span>
              ))}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <motion.button
            className="flex items-center text-gray-600 dark:text-gray-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">{post.replies || post.comments || "0"}</span>
          </motion.button>
          <motion.button
            className="flex items-center text-gray-600 dark:text-gray-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <span className="text-xs">{post.retweets || "0"}</span>
          </motion.button>
          <motion.button
            className="flex items-center text-gray-600 dark:text-gray-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onHoverStart={() => setIsLikeHovered(true)}
            onHoverEnd={() => setIsLikeHovered(false)}
          >
            <motion.div animate={isLikeHovered ? { scale: [1, 1.2, 0.9, 1.1, 1] } : {}} transition={{ duration: 0.5 }}>
              <Heart className="h-4 w-4 mr-1" />
            </motion.div>
            <span className="text-xs">{post.likes || "0"}</span>
          </motion.button>
          <motion.button
            className="flex items-center text-gray-600 dark:text-gray-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Share2 className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>
    )
  }

  // Reddit post
  if (type === "reddit") {
    return (
      <motion.div
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
        whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center mb-2">
          <motion.div className="h-6 w-6 rounded-full overflow-hidden mr-2" whileHover={{ scale: 1.1 }}>
            <img src={avatar || "/placeholder.svg"} alt={username} className="h-full w-full object-cover" />
          </motion.div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {post.subreddit || "r/history"} • Posted by u/{username} • {date}
          </span>
        </div>

        {/* Title */}
        <motion.h3
          className="text-lg font-semibold mb-2"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1, scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          {post.title || "Historical Post"}
        </motion.h3>

        {/* Content */}
        <div className="text-sm mb-3">{content}</div>

        {/* Footer */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <motion.button className="flex items-center mr-4" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>{post.upvotes || "0"}</span>
          </motion.button>
          <motion.button className="flex items-center mr-4" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>{post.comments || "0"} comments</span>
          </motion.button>
          <div className="flex items-center">
            {post.awards &&
              Array.isArray(post.awards) &&
              post.awards.map((award: string, index: number) => (
                <motion.div
                  key={index}
                  className="mr-1 text-yellow-500 flex items-center"
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <Award className="h-4 w-4 mr-1" />
                  <span>{award}</span>
                </motion.div>
              ))}
          </div>
        </div>
      </motion.div>
    )
  }

  // Fallback for unsupported types
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
      <p className="text-gray-400">Unsupported post type: {type}</p>
    </div>
  )
}
