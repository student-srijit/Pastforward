"use client"

import { useEffect, useState } from "react"

interface CursorPosition {
  x: number
  y: number
}

export function QuantumCursor() {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 })
  const [trail, setTrail] = useState<CursorPosition[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const [cursorType, setCursorType] = useState("default")

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY }
      setPosition(newPosition)

      // Update trail with smooth following
      setTrail((prevTrail) => {
        const newTrail = [newPosition, ...prevTrail.slice(0, 7)]
        return newTrail.map((pos, index) => ({
          x: pos.x + (newPosition.x - pos.x) * (0.8 - index * 0.1),
          y: pos.y + (newPosition.y - pos.y) * (0.8 - index * 0.1),
        }))
      })
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target
      if (target instanceof HTMLElement) {
        if (target.classList.contains("cursor-pointer") || target.tagName === "BUTTON" || target.tagName === "A") {
          setIsHovering(true)
          setCursorType("pointer")
        } else if (
          target.classList.contains("cursor-text") ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA"
        ) {
          setCursorType("text")
        } else {
          setIsHovering(false)
          setCursorType("default")
        }
      }
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      setCursorType("default")
    }

    document.addEventListener("mousemove", updateCursor)
    document.addEventListener("mouseenter", handleMouseEnter, true)
    document.addEventListener("mouseleave", handleMouseLeave, true)

    // Hide default cursor
    document.body.style.cursor = "none"

    return () => {
      document.removeEventListener("mousemove", updateCursor)
      document.removeEventListener("mouseenter", handleMouseEnter, true)
      document.removeEventListener("mouseleave", handleMouseLeave, true)
      document.body.style.cursor = "auto"
    }
  }, [])

  return (
    <>
      {/* Main cursor */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-all duration-200 ${
          isHovering ? "scale-150" : "scale-100"
        }`}
        style={{
          transform: `translate(${position.x - 10}px, ${position.y - 10}px)`,
        }}
      >
        <div
          className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
            cursorType === "pointer"
              ? "bg-gradient-to-r from-blue-500 to-purple-500 border-white shadow-lg shadow-blue-500/50"
              : cursorType === "text"
                ? "bg-gradient-to-r from-green-500 to-blue-500 border-white shadow-lg shadow-green-500/50"
                : "bg-gradient-to-r from-purple-500 to-pink-500 border-white/50 shadow-lg shadow-purple-500/30"
          }`}
        />
      </div>

      {/* Trailing dots */}
      {trail.map((pos, index) => (
        <div
          key={index}
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{
            transform: `translate(${pos.x - 3}px, ${pos.y - 3}px)`,
            opacity: 0.8 - index * 0.1,
          }}
        >
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              cursorType === "pointer"
                ? "bg-gradient-to-r from-blue-400 to-purple-400"
                : cursorType === "text"
                  ? "bg-gradient-to-r from-green-400 to-blue-400"
                  : "bg-gradient-to-r from-purple-400 to-pink-400"
            }`}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          />
        </div>
      ))}
    </>
  )
}
