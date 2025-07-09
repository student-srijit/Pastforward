"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

type Particle = {
  x: number
  y: number
  z: number
  originalZ: number
  size: number
  color: string
  speed: number
  opacity: number
  vx: number
  vy: number
  vz: number
}

export function AdvancedCosmosBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMouseMoving, setIsMouseMoving] = useState(false)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Set up canvas and window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }
    }

    // Initial setup
    handleResize()

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Initialize particles
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return

    const particleCount = Math.min(Math.floor((dimensions.width * dimensions.height) / 6000), 400)
    const particles: Particle[] = []

    // Instagram theme colors with more vibrant options
    const colors = [
      "#405DE6", // Instagram blue
      "#5B51D8", // Instagram purple
      "#833AB4", // Instagram purple
      "#C13584", // Instagram pink
      "#E1306C", // Instagram pink
      "#FD1D1D", // Instagram red
      "#F77737", // Instagram orange
      "#FCAF45", // Instagram yellow
      "#FFFFFF", // White
      "#00FFFF", // Cyan
      "#FF00FF", // Magenta
    ]

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * dimensions.width
      const y = Math.random() * dimensions.height
      const z = Math.random() * 1000 // 3D depth
      const size = Math.random() * 3 + 0.5

      particles.push({
        x,
        y,
        z,
        originalZ: z,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.2 + 0.1,
        opacity: Math.random() * 0.7 + 0.3,
        vx: 0,
        vy: 0,
        vz: 0,
      })
    }

    particlesRef.current = particles
  }, [dimensions])

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsMouseMoving(true)

      // Reset the "moving" state after a delay
      clearTimeout(mouseTimeout.current)
      mouseTimeout.current = setTimeout(() => {
        setIsMouseMoving(false)
      }, 100)
    }

    const mouseTimeout = { current: setTimeout(() => {}, 100) }

    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", handleMouseMove)
      }
      clearTimeout(mouseTimeout.current)
    }
  }, [])

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Create a starfield effect
    const drawStarfield = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, isDark ? "#0a0a0a" : "#1a1a2e")
      gradient.addColorStop(1, isDark ? "#111111" : "#16213e")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add some nebula-like effects
      const nebulaGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 1.5,
      )
      nebulaGradient.addColorStop(0, "rgba(131, 58, 180, 0.03)")
      nebulaGradient.addColorStop(0.5, "rgba(253, 29, 29, 0.02)")
      nebulaGradient.addColorStop(1, "rgba(252, 176, 69, 0.01)")
      ctx.fillStyle = nebulaGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Sort particles by z-index for 3D effect
      const sortedParticles = [...particlesRef.current].sort((a, b) => a.z - b.z)

      // Draw particles
      sortedParticles.forEach((particle) => {
        // Calculate distance from mouse
        const dx = mousePosition.x - particle.x
        const dy = mousePosition.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 200

        // Update particle position based on mouse interaction
        if (isMouseMoving && distance < maxDistance) {
          // Repel particles from mouse
          const force = (maxDistance - distance) / maxDistance
          particle.vx -= dx * force * 0.02
          particle.vy -= dy * force * 0.02
          particle.vz += force * 2 // Move toward viewer for 3D effect

          // Limit z movement
          if (particle.z > 1500) particle.vz = -particle.vz * 0.5
          if (particle.z < 0) particle.vz = -particle.vz * 0.5
        } else {
          // Return to original position
          particle.vx *= 0.95
          particle.vy *= 0.95
          particle.vz *= 0.95
          particle.vz += (particle.originalZ - particle.z) * 0.01
        }

        // Apply velocity
        particle.x += particle.vx
        particle.y += particle.vy
        particle.z += particle.vz

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Calculate size based on z position (perspective)
        const perspective = 500
        const scale = perspective / (perspective + particle.z)
        const size = particle.size * scale * 2

        // Skip rendering particles that are too small
        if (size < 0.1) return

        // Calculate opacity based on z position
        const opacity = particle.opacity * scale * 1.5
        if (opacity < 0.01) return

        // Draw particle with glow effect
        const glow = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, size * 3)
        glow.addColorStop(0, particle.color)
        glow.addColorStop(1, "rgba(0,0,0,0)")

        ctx.globalAlpha = opacity * 0.5
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Draw the particle core
        ctx.globalAlpha = opacity
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw mouse interaction effect when mouse is moving
      if (isMouseMoving) {
        const radius = 100
        const gradient = ctx.createRadialGradient(
          mousePosition.x,
          mousePosition.y,
          0,
          mousePosition.x,
          mousePosition.y,
          radius,
        )
        gradient.addColorStop(0, "rgba(225, 48, 108, 0.2)")
        gradient.addColorStop(0.5, "rgba(225, 48, 108, 0.1)")
        gradient.addColorStop(1, "rgba(225, 48, 108, 0)")

        ctx.globalAlpha = 0.7
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(mousePosition.x, mousePosition.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Reset global alpha
      ctx.globalAlpha = 1

      animationRef.current = requestAnimationFrame(drawStarfield)
    }

    drawStarfield()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, mousePosition, isMouseMoving, isDark])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]"
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}
    />
  )
}

export default AdvancedCosmosBackground
