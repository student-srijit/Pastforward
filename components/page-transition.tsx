"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { type ReactNode, useEffect, useState } from "react"

type PageTransitionProps = {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    // After first render, set isFirstRender to false
    setIsFirstRender(false)
  }, [])

  // Different animation for first render vs navigation
  const variants = {
    initial: isFirstRender ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isFirstRender ? 0.8 : 0.5,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.div key={pathname} initial="initial" animate="animate" exit="exit" variants={variants}>
      {children}
    </motion.div>
  )
}
