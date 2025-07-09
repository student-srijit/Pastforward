"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PostCreator } from "@/components/post-creator"
import { PostPreview } from "@/components/post-preview"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Toaster } from "@/components/ui/toaster"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CreatePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [generatedPost, setGeneratedPost] = useState(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/create")
    }
  }, [status, router])

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen">
        <Navbar />
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Sign In Required</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              You need to be signed in to create historical posts
            </p>
            <Button onClick={() => router.push("/auth/signin?callbackUrl=/create")}>Sign In to Continue</Button>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Create Your Historical</span> Social Media Post
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose your era, location, and character type to generate a unique historical post
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <PostCreator setGeneratedPost={setGeneratedPost} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <PostPreview generatedPost={generatedPost} setGeneratedPost={setGeneratedPost} />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
      <Toaster />
    </main>
  )
}
