"use client"

import React from "react"
import { useSidebar } from "@/lib/sidebar-context"
import { LeftSidebar } from "./left-sidebar"

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { isSidebarOpen } = useSidebar()

  return (
    <div className="flex min-h-screen">
      <LeftSidebar />
      <div className="flex-1 md:ml-[220px] py-4">
        {children}
      </div>
    </div>
  )
} 