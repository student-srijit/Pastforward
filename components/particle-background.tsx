"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

type Particle = {
  id: number
  x: number
  y: number
  size: number
  color: string
  speed: number
  direction: number
  opacity: number
  duration: number
}

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })

      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return

    const particleCount = Math.min(Math.floor((dimensions.width * dimensions.height) / 15000), 100)
    const newParticles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      newParticles.push(createParticle(i, dimensions.width, dimensions.height, isDark))
    }

    setParticles(newParticles)
  }, [dimensions, isDark])

  const createParticle = (id: number, width: number, height: number, isDark: boolean): Particle => {
    // Colors for light theme
    const lightColors = [
      "rgba(246, 95, 57, 0.4)",
      "rgba(122, 57, 246, 0.3)",
      "rgba(57, 144, 255, 0.3)",
      "rgba(246, 95, 57, 0.2)",
    ]

    // Colors for dark theme
    const darkColors = [
      "rgba(246, 95, 57, 0.2)",
      "rgba(122, 57, 246, 0.15)",
      "rgba(57, 144, 255, 0.15)",
      "rgba(246, 95, 57, 0.1)",
    ]

    const colors = isDark ? darkColors : lightColors
    const color = colors[Math.floor(Math.random() * colors.length)]

    return {
      id,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 5 + 1,
      color,
      speed: Math.random() * 0.5 + 0.1,
      direction: Math.random() * 360,
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 20 + 10,
    }
  }

  if (particles.length === 0) return null

  return (
    <div className="particles-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            animation: `float ${particle.duration}s infinite`,
            animationDelay: `-${Math.random() * particle.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
