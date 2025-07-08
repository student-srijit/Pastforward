"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="w-10 h-10 rounded-full bg-gray-800"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              <div className="space-y-2">
                <motion.div
                  className="h-4 w-24 bg-gray-800 rounded"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.1 }}
                />
                <motion.div
                  className="h-3 w-16 bg-gray-800 rounded"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.2 }}
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <motion.div
                className="h-4 w-full bg-gray-800 rounded"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.3 }}
              />
              <motion.div
                className="h-4 w-5/6 bg-gray-800 rounded"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.4 }}
              />
              <motion.div
                className="h-4 w-4/6 bg-gray-800 rounded"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
              />
            </div>

            <motion.div
              className="h-48 w-full bg-gray-800 rounded"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.6 }}
            />

            <div className="flex justify-between mt-4">
              <motion.div
                className="h-8 w-20 bg-gray-800 rounded"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.7 }}
              />
              <motion.div
                className="h-8 w-20 bg-gray-800 rounded"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.8 }}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
