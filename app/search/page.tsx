"use client"

import React, { Suspense } from 'react'
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
// Firebase removed - using mock data
import { db } from "@/lib/firebase"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface SearchResult {
  id: string;
  title: string;
  content: string;
    author: {
    name: string;
    avatar: string;
  };
  category: string;
  timestamp: string;
  image: string;
}

interface FirestoreArticle extends DocumentData {
  original_headline?: string;
  headline?: string;
  content?: string;
  user?: string;
  category?: string;
  time?: string;
  image_url?: string;
}

function SearchContent() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get("q") || ""
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function searchArticles() {
      const trimmedQuery = String(searchQuery).trim().toLowerCase()
      if (!trimmedQuery) {
        setResults([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const articlesRef = collection(db, 'generated_content')
        const q = firestoreQuery(
          articlesRef,
          orderBy('time', 'desc'),
          limit(50) // Increased limit for better search results
        )
        
        const querySnapshot = await getDocs(q)
        
        // Enhanced client-side search
        const searchResults = querySnapshot.docs
          .map((doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data() as FirestoreArticle
            return {
              id: doc.id,
              title: (data.original_headline || data.headline || "Untitled").replace(/\*\*|##/g, ''),
              content: (data.content || "").replace(/\*\*|##/g, ''),
              author: {
                name: data.user || "Anonymous",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user || 'anonymous'}`
              },
              category: data.category || "General",
              timestamp: data.time || new Date().toISOString(),
              image: data.image_url || "/placeholder.jpg"
            }
          })
          .filter(article => {
            const titleMatch = article.title.toLowerCase().includes(trimmedQuery)
            const contentMatch = article.content.toLowerCase().includes(trimmedQuery)
            const categoryMatch = article.category.toLowerCase().includes(trimmedQuery)
            const authorMatch = article.author.name.toLowerCase().includes(trimmedQuery)
            
            return titleMatch || contentMatch || categoryMatch || authorMatch
          })

        setResults(searchResults)
      } catch (error) {
        console.error("Error searching articles:", error)
        setResults([])
      }
      setLoading(false)
    }

    searchArticles()
  }, [searchQuery])

  return (
    <main className="flex flex-col min-h-screen pt-20 md:pt-24"> {/* Adjusted padding for better spacing */}
      <div className="flex-1 md:ml-[260px]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="py-6">
            <h1 className="text-2xl font-bold mb-2">
              {searchQuery ? `Search Results for: ${searchQuery}` : 'Search Articles'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {loading ? 'Searching...' : 
               results.length === 0 ? 'No results found' :
               `Found ${results.length} result${results.length === 1 ? '' : 's'}`}
            </p>

            {loading ? (
              // Loading skeleton
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted"></div>
                    <div className="p-4 space-y-4">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((article) => (
                  <Link 
                    key={article.id}
                    href={`/article/${article.id}`}
                    className="group"
                  >
                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge 
                          variant="secondary" 
                          className="absolute top-4 left-4 bg-white/90 dark:bg-black/50"
                        >
                          {article.category}
                        </Badge>
                      </div>

                      <div className="p-5 space-y-4">
                        <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>

                        <p className="text-muted-foreground line-clamp-2">
                          {article.content.slice(0, 120)}...
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={article.author.avatar} />
                              <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{article.author.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(article.timestamp), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{Math.ceil(article.content.length / 1000)} min</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}

