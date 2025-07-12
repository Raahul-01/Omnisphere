"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Loader2, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { adminDb } from "@/lib/firebase-admin"
import { Badge } from "@/components/ui/badge"

interface SearchSuggestion {
  id: string
  title: string
  category: string
  preview: string
  date: string
  tags?: string[]
}

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [trendingSearches] = useState([
    "Technology", "Business", "Innovation", "AI News", "Market Trends"
  ])
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Debounced search suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsLoading(true)
        try {
          const results = await fetchSearchSuggestions(searchQuery)
          setSuggestions(results)
        } catch (error) {
          console.error('Search error:', error)
          setSuggestions([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsFocused(false)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    router.push(`/article/${suggestion.id}`)
    setSearchQuery("")
    setIsFocused(false)
  }

  const handleTrendingClick = (term: string) => {
    setSearchQuery(term)
    router.push(`/search?q=${encodeURIComponent(term)}`)
    setIsFocused(false)
  }

  const openMobileSearch = () => {
    setIsFocused(true)
    // Focus the input after a short delay to ensure the animation is complete
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Mobile Search Icon */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden h-10 w-10 p-2"
        onClick={openMobileSearch}
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Desktop Search Bar and Mobile Search Popup */}
      <div className={`
        ${isFocused ? 'fixed inset-0 z-50 md:static md:z-auto' : 'hidden md:block'}
        bg-background md:bg-transparent
      `}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 md:hidden border-b">
          <h2 className="text-lg font-semibold">Search</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsFocused(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSearch} className="w-full p-4 md:p-0">
          <div className={`
            relative flex items-center transition-all duration-300 w-full
            ${isFocused ? 'ring-2 ring-[#FF7043] ring-offset-2' : 'ring-1 ring-muted'}
            rounded-md bg-background shadow-sm hover:shadow-md
          `}>
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              ref={inputRef}
              placeholder="Search articles, topics, or keywords..."
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleFocus}
              autoComplete="off"
              suppressHydrationWarning
            />
            {isLoading ? (
              <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-muted-foreground" />
            ) : searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 h-8 w-8 p-0 hover:bg-muted/50"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
        </form>

        {/* Suggestions and Trending */}
        <div className={`
          ${isFocused ? 'block' : 'hidden'}
          md:absolute md:top-full left-0 right-0 md:mt-2 bg-background
          md:rounded-lg md:border md:shadow-lg
          h-[calc(100vh-8rem)] md:h-auto md:max-h-[70vh]
          overflow-y-auto
        `}>
          {searchQuery.length >= 2 ? (
            // Search Suggestions
            <div className="p-4 divide-y divide-border">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    className="w-full px-4 py-4 text-left hover:bg-muted/50 rounded-md flex flex-col gap-2 group"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium group-hover:text-[#FF7043]">
                        {suggestion.title}
                      </span>
                      <Badge variant="secondary">
                        {suggestion.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {suggestion.preview}
                    </p>
                  </button>
                ))
              ) : !isLoading && (
                <div className="px-4 py-8 text-center">
                  <p className="text-muted-foreground mb-2">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try different keywords or browse trending topics below
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Trending Searches
            <div className="p-4">
              <div className="px-4 py-3 flex items-center gap-2 font-medium text-muted-foreground border-b">
                <TrendingUp className="h-5 w-5 text-[#FF7043]" />
                Popular Searches
              </div>
              <div className="grid grid-cols-1 gap-2 p-2">
                {trendingSearches.map((term, index) => (
                  <button
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 text-left group"
                    onClick={() => handleTrendingClick(term)}
                  >
                    <span className="text-xl font-bold text-muted-foreground/50">
                      {index + 1}
                    </span>
                    <span className="group-hover:text-[#FF7043] transition-colors">
                      {term}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Real function for fetching search suggestions from Firebase
async function fetchSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
  // Return empty array for now - real search suggestions would come from Firebase
  return [];
}

