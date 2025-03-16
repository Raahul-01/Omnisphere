"use client"

import React from 'react'
import { useEffect, useState } from "react"
import { Article } from "@/types/article"
import { getArticlesByCategory } from "@/services/articles"
import { isFeatureEnabled } from '../src/config/features'
import { useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, BookmarkPlus, TrendingUp, Crown, Star, ArrowRight, BookOpen, LineChart } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, limit, getDocs, DocumentData } from "firebase/firestore"

interface CategoryFeedProps {
  category: string
}

interface FeedItem {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
  }
  category: string
  timestamp: string
  imageUrl: string
  format: string
  lead: string
  body: string
  tail: string
}

// Create a client-only component for dynamic content
const DynamicContent = ({ article }: { article: Article }) => {
  const [mounted, setMounted] = useState(false)
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    setMounted(true)
    if (article.timestamp) {
      const date = new Date(article.timestamp)
      setFormattedDate(formatDistanceToNow(date, { addSuffix: true }))
    }
  }, [article.timestamp])

  if (!mounted) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <>
      <p className="text-xs text-muted-foreground">
        {formattedDate || 'Just now'}
      </p>
      <span>{Math.ceil((article.content?.length || 0) / 1000)} min</span>
    </>
  )
}

// ArticleCard component
const ArticleCard = ({ article }: { article: Article }) => (
  <Link 
    href={`/article/${article.id}`}
    className="group"
  >
    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={article.imageUrl ? `/api/proxy-image?url=${encodeURIComponent(article.imageUrl)}` : `https://picsum.photos/seed/${article.id}/800/600`}
          alt={article.title}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://picsum.photos/seed/${article.id}/800/600`;
          }}
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
          {article.content?.slice(0, 120) || 'No content available'}...
        </p>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={article.author?.avatar || ''} />
              <AvatarFallback>{article.author?.name?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{article.author?.name || 'Anonymous'}</p>
              <DynamicContent article={article} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-4 w-4" />
            <DynamicContent article={article} />
          </div>
        </div>
      </div>
    </Card>
  </Link>
)

export function CategoryFeed({ category }: CategoryFeedProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    let isMounted = true

    async function loadArticles() {
      try {
        setIsLoading(true)
        const postsRef = collection(db, 'posts')
        const q = query(
          postsRef,
          where('categories', 'array-contains', category),
          orderBy('createdAt', 'desc')
        )
        
        const querySnapshot = await getDocs(q)
        const posts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        const items: FeedItem[] = posts.map((post: any) => ({
          id: post.id,
          title: post.title,
          content: post.excerpt || "",
          author: {
            name: post.author?.name || "Author",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.id}`
          },
          category: post.category,
          timestamp: post.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          imageUrl: post.imageUrl || `https://picsum.photos/seed/${post.id}/800/600`,
          format: "hourglass" as const,
          lead: post.excerpt ? `${post.excerpt.slice(0, 100)}...` : "",
          body: post.content || "",
          tail: "Read more..."
        }))

        if (isMounted) {
          setFeedItems(items)
          setError(null)
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load articles')
          console.error('Error loading articles:', error)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (mounted) {
      loadArticles()
    }

    return () => {
      isMounted = false
    }
  }, [category, mounted])

  if (!mounted) {
    return (
      <div className="p-4 text-center animate-pulse">
        <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
      </div>
    )
  }

  if (!isFeatureEnabled('Categories')) {
    router.push('/')
    return null
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p>Loading articles...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  if (feedItems.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>No articles found in {category} category.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {feedItems.map((item) => (
        <ArticleCard key={item.id} article={item} />
      ))}
    </div>
  )
}

export default CategoryFeed 