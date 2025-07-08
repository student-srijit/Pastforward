"use client"

import { motion } from "framer-motion"

export function TimelineVisualizationFallback() {
  const eras = [
    { name: "Ancient", color: "#D4B483" },
    { name: "Medieval", color: "#7D8CC4" },
    { name: "Renaissance", color: "#A86464" },
    { name: "Industrial", color: "#6B7D7D" },
    { name: "Modern", color: "#6BA292" },
  ]

  return (
    <div className="w-full h-[400px] rounded-xl bg-gray-50 dark:bg-gray-800 p-8">
      <h3 className="text-xl font-semibold mb-6 text-center">Historical Timeline</h3>

      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full my-12">
        {eras.map((era, index) => (
          <div
            key={index}
            className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full"
            style={{
              backgroundColor: era.color,
              left: `${index * 25}%`,
            }}
          />
        ))}
      </div>

      <div className="flex justify-between">
        {eras.map((era, index) => (
          <div key={index} className="text-center">
            <motion.div
              className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center"
              style={{ backgroundColor: era.color }}
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-white font-bold">{index + 1}</span>
            </motion.div>
            <p className="text-sm">{era.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TimelineVisualizationFallback
