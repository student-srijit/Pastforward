"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ConfettiEffect } from "./confetti-effect"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const { data: session } = useSession()
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.9])
  const [showConfetti, setShowConfetti] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoverButton, setHoverButton] = useState<string | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleGetStarted = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 5000)

    if (session) {
      router.push("/create")
    } else {
      router.push("/auth/signup")
    }
  }

  // Track mouse position for magnetic buttons
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  // Calculate magnetic pull for buttons
  const getMagneticStyle = (buttonId: string) => {
    if (hoverButton !== buttonId) return {}

    const buttonElement = document.getElementById(buttonId)
    if (!buttonElement) return {}

    const rect = buttonElement.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = mousePosition.x - centerX
    const deltaY = mousePosition.y - centerY

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const maxDistance = 100

    if (distance < maxDistance) {
      const pull = 15 * (1 - distance / maxDistance)
      return {
        transform: `translate(${(deltaX * pull) / distance}px, ${(deltaY * pull) / distance}px)`,
      }
    }

    return {}
  }

  // Floating elements animation variants
  const floatingAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut",
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        repeatDelay: 2,
      },
    }),
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      onMouseMove={handleMouseMove}
    >
      {showConfetti && <ConfettiEffect />}

      {/* Floating social media icons */}
      <motion.div
        className="absolute top-1/4 left-10 md:left-20 hidden md:block"
        style={{ y: useTransform(scrollY, [0, 500], [0, 50]) }}
        animate={{ y: [0, -15, 0], rotate: [-3, 3, -3] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" }}
      >
        <div
          className={cn(
            "w-16 h-16 rounded-xl shadow-lg flex items-center justify-center",
            "bg-gray-900/80 backdrop-blur-md border border-gray-800 rotate-6",
          )}
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-instagram-blue">
            <path
              fill="currentColor"
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-10 md:right-24 hidden md:block"
        style={{ y: useTransform(scrollY, [0, 500], [0, 70]) }}
        animate={{ y: [0, -20, 0], rotate: [3, -2, 3] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 6, ease: "easeInOut", delay: 0.5 }}
      >
        <div
          className={cn(
            "w-14 h-14 rounded-xl shadow-lg flex items-center justify-center",
            "bg-gray-900/80 backdrop-blur-md border border-gray-800 -rotate-6",
          )}
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-instagram-pink2">
            <path
              fill="currentColor"
              d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"
            />
          </svg>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 z-10">
        <motion.div ref={ref} style={{ y, opacity, scale }} className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 flex justify-center"
          >
            <div className="relative w-20 h-20">
              <motion.div
                className="absolute inset-0 bg-instagram-pink2 rounded-2xl"
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-0 bg-instagram-blue rounded-2xl"
                animate={{ rotate: [0, -10, 0, 10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10, ease: "easeInOut", delay: 0.5 }}
              />
              <div className="absolute inset-0 bg-gray-900 rounded-2xl flex items-center justify-center">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-instagram-blue via-instagram-pink2 to-instagram-red">
                  P
                </span>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="shimmer-text">Reimagine History</span> Through
            <br /> Social Media
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto"
          >
            What if Instagram existed during the Indian Independence movement? Or Twitter during the Renaissance?
            Experience history through a modern lens.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            Powered by Google's Gemini AI to create authentic historical content
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.div
              id="get-started-btn"
              onMouseEnter={() => setHoverButton("get-started-btn")}
              onMouseLeave={() => setHoverButton(null)}
              style={getMagneticStyle("get-started-btn")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="instagram-gradient-btn text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all group"
                onClick={handleGetStarted}
              >
                <span className="relative z-10 flex items-center">
                  {session ? "Create Historical Post" : "Get Started"}
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </span>
                <span className="absolute inset-0 rounded-md overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-instagram-blue via-instagram-pink2 to-instagram-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </span>
              </Button>
            </motion.div>

            <motion.div
              id="examples-btn"
              onMouseEnter={() => setHoverButton("examples-btn")}
              onMouseLeave={() => setHoverButton(null)}
              style={getMagneticStyle("examples-btn")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="#examples">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-instagram-pink2 text-instagram-pink2 hover:bg-instagram-pink2/10 px-8 py-6 text-lg group relative overflow-hidden"
                >
                  <span className="relative z-10">View Examples</span>
                  <motion.span
                    className="absolute inset-0 bg-instagram-pink2/10 transform origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating elements */}
          <div className="relative h-32 mt-12">
            {isVisible && (
              <>
                <motion.div
                  custom={1}
                  variants={floatingAnimation}
                  initial="hidden"
                  animate="visible"
                  className="absolute left-1/4 transform -translate-x-1/2"
                >
                  <div className="bg-instagram-blue/20 backdrop-blur-sm p-3 rounded-full">
                    <Sparkles className="h-6 w-6 text-instagram-blue" />
                  </div>
                </motion.div>
                <motion.div
                  custom={2}
                  variants={floatingAnimation}
                  initial="hidden"
                  animate="visible"
                  className="absolute left-1/2 transform -translate-x-1/2"
                >
                  <div className="bg-instagram-pink2/20 backdrop-blur-sm p-4 rounded-full">
                    <span className="text-xl">📱</span>
                  </div>
                </motion.div>
                <motion.div
                  custom={3}
                  variants={floatingAnimation}
                  initial="hidden"
                  animate="visible"
                  className="absolute left-3/4 transform -translate-x-1/2"
                >
                  <div className="bg-instagram-red/20 backdrop-blur-sm p-3 rounded-full">
                    <span className="text-xl">🏛️</span>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <motion.div
              className="w-1 h-2 bg-white rounded-full"
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
            />
          </div>
          <span className="text-white/50 text-xs mt-2">Scroll Down</span>
        </div>
      </motion.div>
    </section>
  )
}
