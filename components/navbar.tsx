"use client"

import { SearchBar } from "@/components/search-bar"
import { Menu, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/lib/sidebar-context"
import { useTheme } from "next-themes"

export function Navbar() {
  const { toggleLeftSidebar } = useSidebar()
  const { theme, setTheme } = useTheme()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b h-14">
      <div className="flex items-center px-4 h-full">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 mr-2"
          onClick={toggleLeftSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Logo */}
        <div className="mr-4 font-bold text-2xl tracking-tight">
          <span className="text-[#FF7043]">Omini</span>
          <span className="text-black dark:text-white">Sphere</span>
          <span className="text-[#FF7043]">.</span>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-2xl mx-auto">
          <SearchBar />
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-4"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  )
} 