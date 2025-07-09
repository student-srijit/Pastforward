"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Search, PlusSquare, Heart, User, Settings, Clock, Compass, Menu, X } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const navItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/search", label: "Search", icon: Search },
    { href: "/create", label: "Create", icon: PlusSquare },
    { href: "/timeline", label: "Timeline", icon: Clock },
    { href: "/notifications", label: "Notifications", icon: Heart },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <>
      {/* Mobile toggle button */}
      <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleSidebar}>
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-gray-900/80 backdrop-blur-md border-r border-gray-800 pt-20 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="px-4 mb-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-instagram-pink2 rounded-md rotate-3"></div>
              <div className="absolute inset-0 bg-instagram-blue rounded-md -rotate-3"></div>
              <div className="absolute inset-0 bg-gray-900 rounded-md flex items-center justify-center">
                <span className="text-instagram-pink2 font-bold">P</span>
              </div>
            </div>
            <span className="text-xl font-bold text-gradient">PastForward</span>
          </Link>
        </div>

        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive ? "bg-gray-800/60 text-white" : "text-gray-400 hover:bg-gray-800/40 hover:text-white",
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
