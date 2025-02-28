"use client"

import { useEffect, useState } from "react"
import { Feed, FeedItem } from "@/components/feed"
import { Article } from "@/types/article"
import { getArticlesByCategory } from "@/services/articles"
import { isFeatureEnabled } from '../src/config/features'
import { useRouter } from 'next/navigation'
import { PostCard } from "@/components/post-card"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"

interface CategoryFeedProps {
  category: string
}

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
          timestamp: post.createdAt?.toDate?.() || new Date(),
          image: post.imageUrl,
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
        <PostCard key={item.id} post={item} />
      ))}
    </div>
  )
}

export default CategoryFeed 