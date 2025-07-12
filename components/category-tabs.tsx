"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { getCategoriesForTabs } from "@/lib/categories"

const categories = getCategoriesForTabs()

export function CategoryTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "all"
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButtons, setShowScrollButtons] = useState({
    left: false,
    right: false
  })

  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      router.push("/")
    } else {
      router.push(`/?category=${category}`)
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const checkScroll = () => {
      setShowScrollButtons({
        left: container.scrollLeft > 0,
        right: container.scrollLeft < (container.scrollWidth - container.clientWidth)
      })
    }

    container.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)
    checkScroll()

    return () => {
      container.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 200
    const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
  }

  return (
    <div className="w-full bg-background border-b h-[32px]">
      <div className="container mx-auto relative h-full px-0">
        {/* Scroll Shadow Indicators */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity"
          style={{ opacity: showScrollButtons.left ? 1 : 0 }}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity"
          style={{ opacity: showScrollButtons.right ? 1 : 0 }}
        />

        {/* Scroll Buttons */}
        {showScrollButtons.left && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full bg-background border shadow-sm hover:bg-muted"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
        )}
        {showScrollButtons.right && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full bg-background border shadow-sm hover:bg-muted"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        )}

        {/* Categories */}
        <div 
          ref={scrollContainerRef}
          className="h-full overflow-x-auto scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="flex gap-1 h-full items-center px-6">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={cn(
                  "shrink-0 inline-flex items-center px-2.5 h-6 rounded-full text-xs font-medium transition-colors",
                  category.value === currentCategory
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

