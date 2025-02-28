"use client"

import { usePathname } from "next/navigation"
import { LeftSidebar } from "@/components/left-sidebar"
import { HomeIcon, Flame, ClockIcon, TagIcon } from "lucide-react"
import { memo, useMemo } from 'react'
import { Navbar } from "@/components/navbar"

interface ClientLayoutProps {
  children: React.ReactNode
}

// Memoize the navigation array since it's static
const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Trending', href: '/trending', icon: Flame },
  { name: 'History', href: '/history', icon: ClockIcon },
  { name: 'Categories', href: '/categories', icon: TagIcon },
] as const

// List of auth-related routes
const AUTH_ROUTES = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password"]

// Memoize the entire ClientLayout component
export const ClientLayout = memo(function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()
  
  // Memoize the auth page check
  const isAuthPage = useMemo(() => 
    pathname ? AUTH_ROUTES.includes(pathname) : false,
    [pathname]
  )

  if (isAuthPage) {
    return <main className="flex-1 flex flex-col min-h-screen">{children}</main>
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen">
        <div className="h-full">
          <LeftSidebar />
        </div>
        <main className="flex-1 flex flex-col min-h-screen pt-14">
          <div className="flex-1 w-full">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}) 