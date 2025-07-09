"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { TopNavbar } from "./top-navbar"
import { AdvancedCosmosBackground } from "@/components/advanced-cosmos-background"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AdvancedCosmosBackground />
      <TopNavbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-64 pt-16">{children}</main>
      </div>
    </div>
  )
}
