"use client"

import { Button } from "@/components/ui/button"
import { Grid2X2, List, Bookmark } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const newsItems = [
  {
    id: "1",
    title: "A man was arrested for stealing chickens from the mayor's house in West Wakanda",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Vi3DUWBxo19Sb5I7oaAqudbSVqyeLf.png",
    author: {
      name: "Hayam uruk",
      avatar: "/placeholder.svg",
      category: "Criminal",
    },
    timeAgo: "2h ago",
    description: "According to the police report, the man was suspected of carrying out the theft at the mayor's o...",
  },
  {
    id: "2",
    title: "Poultry Pilfering Perpetrator Caught Red-Handed at West Wakanda Mayor's Residence",
    image: "/placeholder.svg?height=100&width=100",
    author: {
      name: "Jebakan Batman",
      avatar: "/placeholder.svg",
      category: "Criminal",
    },
    timeAgo: "1h ago",
  },
  {
    id: "3",
    title: "West Wakanda Man Arrested for Stealing Mayor's Chickens",
    image: "/placeholder.svg?height=100&width=100",
    author: {
      name: "Sekitar Depok",
      avatar: "/placeholder.svg",
      category: "Criminal",
    },
    timeAgo: "8h ago",
  },
  {
    id: "4",
    title: "Thief Caught Stealing Chickens from West Wakanda Mayor's Home",
    image: "/placeholder.svg?height=100&width=100",
    author: {
      name: "Police Department",
      avatar: "/placeholder.svg",
      category: "Criminal",
    },
    timeAgo: "12h ago",
  },
  {
    id: "5",
    title: "Scientists Unveil Breakthrough in Renewable Energy Storage Technology",
    image: "/placeholder.svg?height=100&width=100",
    author: {
      name: "H+",
      avatar: "/placeholder.svg",
      category: "Technology",
    },
    timeAgo: "Yesterday",
    description:
      "A team of researchers has developed a new type of battery that could revolutionize renewable energy storage...",
  },
  {
    id: "6",
    title: "Global Climate Summit Reaches Landmark Agreement on Emissions Reduction",
    image: "/placeholder.svg?height=100&width=100",
    author: {
      name: "EcoWatch",
      avatar: "/placeholder.svg",
      category: "Environment",
    },
    timeAgo: "3d ago",
    description:
      "World leaders have agreed to ambitious targets for reducing greenhouse gas emissions in a historic climate accord...",
  },
  {
    id: "7",
    title: "Tech Giant Unveils Next-Generation Smartphone with Revolutionary AI Features",
    image: "/placeholder.svg?height=100&width=100",
    author: {
      name: "TechCrunch",
      avatar: "/placeholder.svg",
      category: "Technology",
    },
    timeAgo: "4h ago",
  },
  {
    id: "8",
    title: "Major Breakthrough in Cancer Research: New Treatment Shows Promising Results",
    image: "/placeholder.svg?height=100&width=100",
    author: {
      name: "MedicalNews",
      avatar: "/placeholder.svg",
      category: "Health",
    },
    timeAgo: "1d ago",
    description:
      "A groundbreaking study has revealed a new treatment method that could significantly improve cancer survival rates...",
  },
  {
    id: "9",
    title: "Stock Markets Soar as Global Economy Shows Signs of Recovery",
    image: "/placeholder.svg?height=100&width=100",
    author: {
      name: "FinancialTimes",
      avatar: "/placeholder.svg",
      category: "Finance",
    },
    timeAgo: "6h ago",
  },
  {
    id: "10",
    title: "Archaeologists Uncover Ancient City in Remote Jungle, Rewriting History Books",
    image: "/placeholder.svg?height=100&width=100",
    author: {
      name: "HistoryToday",
      avatar: "/placeholder.svg",
      category: "Archaeology",
    },
    timeAgo: "2d ago",
    description:
      "An international team of archaeologists has discovered the ruins of a previously unknown ancient civilization...",
  },
]

export default function Saved() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [savedArticles, setSavedArticles] = useState<any[]>([])

  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem("savedArticles") : null
      if (saved) {
        const parsed = JSON.parse(saved)
        // Ensure we always have an array
        if (Array.isArray(parsed)) {
          setSavedArticles(parsed)
        }
      }
    } catch (err) {
      // If parsing fails or data is corrupted, clear the invalid storage entry to avoid repeated crashes
      console.error('Failed to read saved articles from localStorage:', err)
      localStorage.removeItem("savedArticles")
    }
  }, [])

  const savedItems = newsItems.filter((item) => savedArticles.includes(item.id))

  const toggleSave = (id: string) => {
    const newSavedArticles = savedArticles.filter((articleId) => articleId !== id)
    setSavedArticles(newSavedArticles)
    localStorage.setItem("savedArticles", JSON.stringify(newSavedArticles))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Saved Articles</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div
          className={`p-4 ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}`}
        >
          {savedItems.map((item) => (
            <div key={item.id} className={`border rounded-lg overflow-hidden group ${viewMode === "list" ? "flex" : ""}`}>
              <div className={`${viewMode === "grid" ? "aspect-video" : "w-1/3"} bg-gray-100 relative`}>
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => toggleSave(item.id)}
                >
                  <Bookmark className="h-4 w-4 fill-current" />
                </Button>
              </div>
              <div className={`p-4 space-y-2 ${viewMode === "list" ? "w-2/3" : ""}`}>
                <Link href={`/article/${item.id}`}>
                  <h3 className="font-semibold line-clamp-2 hover:underline">{item.title}</h3>
                </Link>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={item.author.avatar} />
                    <AvatarFallback>{item.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center text-sm">
                    <span className="font-medium">{item.author.name}</span>
                    <span className="mx-1">•</span>
                    <Badge variant="secondary">{item.author.category}</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{item.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

