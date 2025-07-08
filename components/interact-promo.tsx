"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Instagram, Twitter, MessageSquare } from "lucide-react"

export function InteractPromo() {
  return (
    <section className="py-20 bg-gray-950 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="text-gradient">Experience the Interactive Feed</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
          >
            Explore our Instagram-like interface to browse, like, and comment on historical posts
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4">Interact with History</h3>
              <p className="text-gray-300 mb-6">
                Our interactive feed lets you experience history through a modern social media lens. Like posts, leave
                comments, and share your favorite historical moments.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
                  <Instagram className="h-4 w-4 text-instagram-pink2" />
                  <span className="text-sm">Instagram Style</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
                  <Twitter className="h-4 w-4 text-instagram-blue" />
                  <span className="text-sm">Twitter Format</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
                  <MessageSquare className="h-4 w-4 text-instagram-red" />
                  <span className="text-sm">Reddit Threads</span>
                </div>
              </div>
              <Link href="/interact">
                <Button className="w-full instagram-gradient-btn text-white">Go to Interactive Feed</Button>
              </Link>
            </div>
            <div className="bg-gray-800 relative overflow-hidden hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-instagram-blue/20 via-instagram-purple/20 to-instagram-pink2/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-96 bg-gray-900 rounded-3xl shadow-2xl transform rotate-6 border border-gray-700 overflow-hidden">
                  <div className="h-12 bg-gray-800 flex items-center px-4 border-b border-gray-700">
                    <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                    <div className="ml-2 h-4 w-24 bg-gray-700 rounded"></div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="h-4 w-full bg-gray-800 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-800 rounded"></div>
                    <div className="h-40 bg-gray-800 rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-800 rounded-full"></div>
                      <div className="h-8 w-8 bg-gray-800 rounded-full"></div>
                      <div className="h-8 w-8 bg-gray-800 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
