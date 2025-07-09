"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Save, User, Mail, AtSign, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export default function SettingsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/users/${session.user.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await response.json()

        setFormData({
          name: data.user.name || "",
          username: data.user.username || "",
          email: data.user.email || "",
          bio: data.user.bio || "",
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load your profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchUserData()
    } else if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/settings")
    }
  }, [session, status, router, toast])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(`/api/users/${session?.user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      // Update session data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          username: formData.username,
        },
      })

      toast({
        title: "Success",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Account Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <label htmlFor="name" className="font-medium">
                          Full Name
                        </label>
                      </div>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AtSign className="h-4 w-4 text-gray-500" />
                        <label htmlFor="username" className="font-medium">
                          Username
                        </label>
                      </div>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => handleChange("username", e.target.value.toLowerCase().replace(/\s+/g, ""))}
                        placeholder="Your username"
                      />
                      <p className="text-xs text-gray-500">
                        This will be used in your profile URL: pastforward.com/profile/{formData.username}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <label htmlFor="email" className="font-medium">
                          Email Address
                        </label>
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="Your email address"
                        disabled
                      />
                      <p className="text-xs text-gray-500">
                        Email address cannot be changed. Contact support if you need to update it.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <label htmlFor="bio" className="font-medium">
                          Bio
                        </label>
                      </div>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleChange("bio", e.target.value)}
                        placeholder="Tell us about yourself..."
                        className="min-h-[120px]"
                      />
                      <p className="text-xs text-gray-500">
                        Brief description that will appear on your profile. Max 500 characters.
                      </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Preview how others see you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={session?.user?.image || ""} alt={formData.name} />
                      <AvatarFallback>{formData.name.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold">{formData.name || "Your Name"}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">@{formData.username || "username"}</p>
                    <p className="text-sm mb-6">{formData.bio || "Your bio will appear here..."}</p>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/profile/${session?.user?.id}`)}>
                      View Public Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
