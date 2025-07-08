"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  const steps = [
    {
      number: "01",
      title: "Input Your Parameters",
      description: "Choose the historical era, location, and character type you want to explore.",
      delay: 0,
      color: "#405DE6", // Instagram blue
    },
    {
      number: "02",
      title: "AI Generates Content",
      description: "Our advanced AI creates authentic posts based on historical context and language patterns.",
      delay: 0.1,
      color: "#833AB4", // Instagram purple
    },
    {
      number: "03",
      title: "Review & Customize",
      description: "Edit the generated content or request variations until you're satisfied.",
      delay: 0.2,
      color: "#E1306C", // Instagram pink
    },
    {
      number: "04",
      title: "Share Your Creation",
      description: "Download or share your historical social media post with friends or for educational purposes.",
      delay: 0.3,
      color: "#FD1D1D", // Instagram red
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="text-gradient">How It Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Creating historical social media posts is simple and fun
          </motion.p>
        </div>

        <div ref={ref} className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-instagram-blue via-instagram-pink2 to-instagram-red transform md:translate-x-[-50%] hidden md:block"></div>

          {/* Steps */}
          <div className="space-y-12 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: step.delay }}
                className={cn(
                  "flex flex-col md:flex-row gap-8 items-center",
                  index % 2 === 1 ? "md:flex-row-reverse" : "",
                )}
              >
                <div className="flex-1">
                  <div
                    className={cn(
                      "bg-gray-900 p-6 rounded-xl shadow-md",
                      "border border-gray-800",
                      "relative z-10 hover:shadow-lg transition-all duration-300",
                    )}
                    style={{ boxShadow: `0 4px 20px -5px ${step.color}30` }}
                  >
                    <div className="text-4xl font-bold mb-2" style={{ color: step.color }}>
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                </div>

                <div
                  className="md:w-10 md:h-10 w-8 h-8 rounded-full flex items-center justify-center z-10 md:mx-0 mx-auto"
                  style={{ background: `linear-gradient(135deg, ${step.color}, rgba(0,0,0,0.5))` }}
                >
                  <div className="md:w-5 md:h-5 w-4 h-4 bg-gray-900 rounded-full"></div>
                </div>

                <div className="flex-1 md:block hidden"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
