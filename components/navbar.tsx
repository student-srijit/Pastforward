"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, User, BookOpen, Zap, Search, Settings, Menu, X, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoverButton, setHoverButton] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
    const maxDistance = 80

    if (distance < maxDistance) {
      const pull = 12 * (1 - distance / maxDistance)
      return {
        transform: `translate(${(deltaX * pull) / distance}px, ${(deltaY * pull) / distance}px)`,
      }
    }
    return {}
  }

  const navItems = [
    { icon: Home, href: "/", label: "Home" },
    { icon: BookOpen, href: "/create", label: "Create" },
    { icon: Zap, href: "/#how-it-works", label: "How It Works" },
    { icon: Search, href: "/#examples", label: "Examples" },
    { icon: Search, href: "/search", label: "Search" },
  ]

  const authNavItems = session
    ? [
        { icon: User, href: "/dashboard", label: "Dashboard" },
        { icon: Settings, href: "/settings", label: "Settings" },
      ]
    : []

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/10 py-2" : "bg-transparent py-4",
      )}
      onMouseMove={handleMouseMove}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-8 h-8"
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg rotate-3 group-hover:rotate-6 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg -rotate-3 group-hover:-rotate-6 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm group-hover:scale-110 transition-all duration-300">
                  PF
                </span>
              </div>
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-white bg-clip-text text-transparent">
                PastForward
              </h1>
              <p className="text-xs text-gray-400 -mt-1">Tech</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Navigation Items */}
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  onMouseEnter={() => setHoverButton(`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`)}
                  onMouseLeave={() => setHoverButton(null)}
                  style={getMagneticStyle(`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
                    title={item.label}
                  >
                    <item.icon className="w-4 h-4 text-white/70 hover:text-white" />
                  </Button>
                </motion.div>
              </Link>
            ))}

            {/* Auth Items */}
            {authNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  id={`auth-${item.label.toLowerCase()}`}
                  onMouseEnter={() => setHoverButton(`auth-${item.label.toLowerCase()}`)}
                  onMouseLeave={() => setHoverButton(null)}
                  style={getMagneticStyle(`auth-${item.label.toLowerCase()}`)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
                    title={item.label}
                  >
                    <item.icon className="w-4 h-4 text-white/70 hover:text-white" />
                  </Button>
                </motion.div>
              </Link>
            ))}

            {/* Authentication Buttons */}
            {!session ? (
              <div className="flex items-center space-x-2 ml-4">
                <motion.div
                  id="signin-btn"
                  onMouseEnter={() => setHoverButton("signin-btn")}
                  onMouseLeave={() => setHoverButton(null)}
                  style={getMagneticStyle("signin-btn")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300 bg-transparent"
                    onClick={() => router.push("/auth/signin")}
                  >
                    <LogIn className="mr-2 h-3 w-3" />
                    Sign In
                  </Button>
                </motion.div>
                <motion.div
                  id="signup-btn"
                  onMouseEnter={() => setHoverButton("signup-btn")}
                  onMouseLeave={() => setHoverButton(null)}
                  style={getMagneticStyle("signup-btn")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="default"
                    size="sm"
                    className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                    onClick={() => router.push("/auth/signup")}
                  >
                    <UserPlus className="mr-2 h-3 w-3" />
                    Sign Up
                  </Button>
                </motion.div>
              </div>
            ) : (
              <motion.div
                id="dashboard-btn"
                onMouseEnter={() => setHoverButton("dashboard-btn")}
                onMouseLeave={() => setHoverButton(null)}
                style={getMagneticStyle("dashboard-btn")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-4"
              >
                <Button
                  variant="default"
                  size="sm"
                  className="cursor-pointer bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </Button>
              </motion.div>
            )}

            {/* Mode Toggle */}
            
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
           
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10"
            >
              <div className="space-y-3">
                {/* Navigation Links */}
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className="cursor-pointer w-full justify-start text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                ))}

                {/* Auth Section */}
                <div className="border-t border-white/10 pt-3 mt-3">
                  {session ? (
                    <div className="space-y-2">
                      <Link href="/dashboard">
                        <Button
                          variant="ghost"
                          className="cursor-pointer w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/settings">
                        <Button
                          variant="ghost"
                          className="cursor-pointer w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="cursor-pointer w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10 bg-transparent"
                        onClick={() => {
                          router.push("/auth/signin")
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                      <Button
                        variant="default"
                        className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        onClick={() => {
                          router.push("/auth/signup")
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
