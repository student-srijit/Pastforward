"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Calendar, MapPin, User, ImageIcon, Hash, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { ParticleBackground } from "./particle-background"

// Add a state for the hovered feature
export function Features() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-timeline-600" />,
      title: "Choose an Era",
      description: "Select any historical period from ancient civilizations to recent decades.",
      delay: 0,
      gradient: "gradient-ancient",
    },
    {
      icon: <MapPin className="h-10 w-10 text-timeline-600" />,
      title: "Pick a Location",
      description: "Specify the geographical context for more accurate historical representation.",
      delay: 0.1,
      gradient: "gradient-medieval",
    },
    {
      icon: <User className="h-10 w-10 text-timeline-600" />,
      title: "Select Character Type",
      description: "Choose from various social roles like poet, farmer, soldier, or royalty.",
      delay: 0.2,
      gradient: "gradient-renaissance",
    },
    {
      icon: <ImageIcon className="h-10 w-10 text-timeline-600" />,
      title: "Generate Visuals",
      description: "Optionally create AI-generated images that match the historical context.",
      delay: 0.3,
      gradient: "gradient-industrial",
    },
    {
      icon: <Hash className="h-10 w-10 text-timeline-600" />,
      title: "Authentic Hashtags",
      description: "Get period-appropriate hashtags that blend history with modern social media.",
      delay: 0.4,
      gradient: "gradient-modern",
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-timeline-600" />,
      title: "Interactive Comments",
      description: "See how contemporaries might have responded to the historical post.",
      delay: 0.5,
      gradient: "text-gradient",
    },
  ]

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Add subtle particle background */}
      <div className="absolute inset-0 opacity-30">
        <ParticleBackground />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="shimmer-text">Features</span> That Make History Come Alive
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Customize your historical social media experience with these powerful options
          </motion.p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: feature.delay }}
              className={cn(
                "bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md",
                "transition-all duration-300",
                "border border-gray-100 dark:border-gray-700",
                hoveredFeature === index ? "shadow-xl scale-105" : "hover:shadow-lg hover:scale-[1.02]",
              )}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="mb-4 p-3 bg-timeline-50 dark:bg-timeline-900/20 rounded-full w-fit">{feature.icon}</div>
              <h3 className={cn("text-xl font-semibold mb-2", hoveredFeature === index ? feature.gradient : "")}>
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>

              {/* Add a subtle animated border when hovered */}
              {hoveredFeature === index && (
                <motion.div
                  className="absolute inset-0 -z-10 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="animated-border h-full w-full"></div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
