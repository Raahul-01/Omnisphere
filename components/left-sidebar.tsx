"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/lib/sidebar-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Home, 
  TrendingUp, 
  Bookmark, 
  Settings, 
  HelpCircle, 
  User, 
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  Zap,
  Clock,
  Hash
} from "lucide-react"
// Firebase removed - using mock auth
import { useAuth } from "@/lib/auth-context"

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  href: string
  badge?: string | number
  isActive?: boolean
  onClick?: () => void
}

function SidebarItem({ icon: Icon, label, href, badge, isActive, onClick }: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1">{label}</span>
      {badge && (
        <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
          {badge}
        </Badge>
      )}
    </Link>
  )
}

const mainNavigation = [
  { icon: Home, label: "Home", href: "/" },
  { icon: TrendingUp, label: "Trending", href: "/trending" },
  { icon: Clock, label: "Recent", href: "/recent" },
  { icon: Bookmark, label: "Saved", href: "/saved" },
]

const categories = [
  { icon: Zap, label: "Technology", href: "/category/technology", badge: "128" },
  { icon: Hash, label: "Business", href: "/category/business", badge: "89" },
  { icon: Hash, label: "Science", href: "/category/science", badge: "67" },
  { icon: Hash, label: "World", href: "/category/world", badge: "156" },
  { icon: Hash, label: "Sports", href: "/category/sports", badge: "43" },
]

const bottomNavigation = [
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help", href: "/help" },
]

export function LeftSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const { isLeftSidebarOpen, toggleLeftSidebar } = useSidebar()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show mock user for demonstration
  const currentUser = user || {
    uid: 'demo-user',
    email: 'demo@example.com',
    displayName: 'Demo User'
  }

  if (!mounted) {
    return (
      <aside className="fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 border-r bg-background">
        <div className="flex h-full animate-pulse flex-col">
          <div className="h-16 bg-muted"></div>
        </div>
      </aside>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isLeftSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={toggleLeftSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 transform border-r bg-background transition-transform duration-200 ease-in-out",
          isLeftSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* User section */}
          <div className="p-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`} />
                <AvatarFallback>
                  {currentUser.displayName?.[0] || currentUser.email?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">
                  {currentUser.displayName || 'Anonymous User'}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {currentUser.email || 'No email'}
                </p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 px-4">
            <div className="space-y-6">
              {/* Main Navigation */}
              <div>
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Navigation
                </h3>
                <nav className="space-y-1">
                  {mainNavigation.map((item) => (
                    <SidebarItem
                      key={item.href}
                      {...item}
                      isActive={pathname === item.href}
                    />
                  ))}
                </nav>
              </div>

              <Separator />

              {/* Categories */}
              <div>
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Categories
                </h3>
                <nav className="space-y-1">
                  {categories.map((item) => (
                    <SidebarItem
                      key={item.href}
                      {...item}
                      isActive={pathname === item.href}
                    />
                  ))}
                </nav>
              </div>

              <Separator />

              {/* Bottom Navigation */}
              <div>
                <nav className="space-y-1">
                  {bottomNavigation.map((item) => (
                    <SidebarItem
                      key={item.href}
                      {...item}
                      isActive={pathname === item.href}
                    />
                  ))}
                </nav>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4">
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">
                OmniSphere v1.0
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

