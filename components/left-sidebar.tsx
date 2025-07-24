"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Newspaper,
  TrendingUp,
  ListFilter,
  Star,
  Settings,
  LogOut,
  User,
  UserPlus,
  Menu,
  Briefcase,
  Library,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useCallback, memo, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSidebar } from "@/lib/sidebar-context"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

const routes = [
  {
    label: 'Home',
    icon: Home,
    href: '/',
    color: "text-orange-500",
    description: "Your personalized feed"
  },
  
  {
    label: 'Jobs',
    icon: Briefcase,
    color: "text-orange-700",
    href: '/jobs',
    description: "Career opportunities"
  },
  {
    label: 'Categories',
    icon: ListFilter,
    color: "text-orange-600",
    href: '/categories',
    description: "Browse by topics"
  },
  {
    label: 'All Articles',
    icon: FileText,
    color: "text-orange-600",
    href: '/articles',
    description: "Browse all articles"
  },
  {
    label: 'Trending',
    icon: TrendingUp,
    color: "text-orange-500",
    href: '/trending',
    description: "Most popular now"
  },
  {
    label: 'Best of Week',
    icon: Star,
    color: "text-yellow-500",
    href: '/best-of-week',
    description: "Weekly highlights"
  },
  {
    label: 'My Library',
    icon: Library,
    color: "text-orange-400",
    href: '/library',
    description: "Saved content"
  }
] as const;

// Bottom items for signed-in users
const signedInItems = [
  { name: "Profile", icon: User, href: "/profile", description: " " },
  { name: "Website Info", icon: Settings, href: "/website-info", description: " " },
] as const;

// Bottom items for non-signed-in users
const signedOutItems = [
  { name: "Website Info", icon: Settings, href: "/website-info", description: "About OmniSphere" },
] as const;

// Memoized navigation button component
const NavButton = memo(({ 
  href, 
  icon: Icon, 
  label, 
  color, 
  description,
  isActive 
}: { 
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  color: string
  description: string
  isActive: boolean 
}) => (
  <Button
    variant={isActive ? "secondary" : "ghost"}
    className={cn(
      "w-full justify-start gap-2 pl-2 relative group h-auto py-2",
      isActive && "bg-orange-50 dark:bg-orange-950/50 text-orange-600"
    )}
    asChild
  >
    <Link href={href}>
      <div className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4", color)} />
        <div className="flex flex-col items-start gap-0">
          <span className="font-medium leading-none">{label}</span>
          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors mt-0.5">
            {description}
          </span>
        </div>
      </div>
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full" />
      )}
    </Link>
  </Button>
));

NavButton.displayName = 'NavButton';

// Memoize the entire LeftSidebar component
export const LeftSidebar = memo(function LeftSidebar() {
  const pathname = usePathname()
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const router = useRouter()
  const { isSidebarOpen, toggleSidebar } = useSidebar()
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Memoize routes to prevent unnecessary re-renders
  const memoizedRoutes = useMemo(() => routes, [])
  const memoizedBottomItems = useMemo(() => 
    isSignedIn ? signedInItems : signedOutItems, 
    [isSignedIn]
  )

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user)
      if (user?.displayName || user?.email) {
        setUserName(user.displayName || (user.email ? user.email.split('@')[0] : "") || "")
      }
    });

    return () => unsubscribe()
  }, [])

  // Handle transition state
  useEffect(() => {
    if (isSidebarOpen !== undefined) {
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 200) // Match the transition duration
      return () => clearTimeout(timer)
    }
  }, [isSidebarOpen])

  const handleSignOut = useCallback(async () => {
    try {
      await auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }, [router])

  return (
    <>
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-[220px] bg-background border-r-0 transition-transform duration-200 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0", // Always visible on desktop
        isTransitioning ? "pointer-events-none" : "pointer-events-auto"
      )}>
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="p-4 sticky top-0 bg-background z-10 border-b">
            <div className="font-bold text-2xl tracking-tight">
              <span className="text-orange-500">Omni</span>
              <span>Sphere</span>
              <span className="text-orange-500">.</span>
            </div>
          </div>

          <div className="flex-1 px-4 py-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="space-y-1">
                {memoizedRoutes.map((route) => (
                  <NavButton
                    key={route.href}
                    href={route.href}
                    icon={route.icon}
                    label={route.label}
                    color={route.color}
                    description={route.description}
                    isActive={pathname === route.href}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 mt-auto sticky bottom-0 bg-background border-t">
            <Separator className="mb-4" />
            {memoizedBottomItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start mb-1 relative group"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span>{item.name}</span>
                    <span className="text-xs text-muted-foreground group-hover:text-foreground">
                      {item.description}
                    </span>
                  </div>
                </Link>
              </Button>
            ))}

            {isSignedIn ? (
              <>
                <Separator className="my-4" />
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-orange-600">
                        {userName[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{userName}</span>
                      <span className="text-xs text-muted-foreground">Signed in</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                asChild
              >
                <Link href="/auth">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-2 z-50 md:hidden h-8 w-8 p-0"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  )
})

