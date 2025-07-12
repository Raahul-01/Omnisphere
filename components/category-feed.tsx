"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { Article } from "@/lib/types"
import { isFeatureEnabled } from '@/lib/features'
import { useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore"
import { normalizeCategoryName } from "@/lib/categories"

interface CategoryFeedProps {
  category: string
}

// Create a client-only component for dynamic content
const DynamicContent = ({ article, type }: { article: Article, type: 'date' | 'readTime' }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className="text-xs text-muted-foreground">...</span>
  }

  if (type === 'date') {
    try {
      const date = new Date(article.timestamp)
      return (
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(date, { addSuffix: true })}
        </p>
      )
    } catch {
      return <p className="text-xs text-muted-foreground">Just now</p>
    }
  }

  if (type === 'readTime') {
    const readTime = Math.ceil((article.content?.length || 0) / 1000)
    return <span>{readTime} min</span>
  }

  return null
}

// ArticleCard component
const ArticleCard = ({ article }: { article: Article }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const defaultImage = '/images/default-article.jpg';
  
  // Memoize the image URL calculation
  const imageUrl = useMemo(() => {
    const articleImage = (article as any).imageUrl || article.image;
    if (!articleImage) return defaultImage;
    try {
      const urlObj = new URL(articleImage);
      const blockedDomains = [
        'lookaside.fbsbx.com',
        'lookaside.instagram.com',
        'facebook.com',
        'fb.com'
      ];
      
      if (blockedDomains.some(domain => urlObj.hostname.includes(domain))) {
        return defaultImage;
      }

      const trustedDomains = [
        'firebasestorage.googleapis.com',
        'api.dicebear.com',
        'picsum.photos',
        'upload.wikimedia.org',
        'electrek.co',
        'assets.nintendo.com',
        'images.unsplash.com',
        'images.pexels.com',
        'ui-avatars.com'
      ];
      
      return trustedDomains.some(domain => urlObj.hostname.includes(domain))
        ? articleImage
        : defaultImage;
    } catch {
      return defaultImage;
    }
  }, [article.image, (article as any).imageUrl]);

  return (
    <Link href={`/article/${article.id}`} className="group" prefetch={false}>
      <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="relative h-52 overflow-hidden">
          <div className={`absolute inset-0 bg-gray-200 animate-pulse ${!isLoading && 'hidden'}`} />
          <Image
            src={imageError ? defaultImage : imageUrl}
            alt={article.title || 'Article image'}
            fill
            className={`object-cover transform group-hover:scale-105 transition-transform duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onError={() => setImageError(true)}
            onLoad={() => setIsLoading(false)}
            priority={false}
            unoptimized={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
          <Badge 
            variant="secondary" 
            className="absolute top-4 left-4 bg-white/90 dark:bg-black/50 z-10"
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
                <DynamicContent article={article} type="date" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              <DynamicContent article={article} type="readTime" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export function CategoryFeed({ category }: CategoryFeedProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [feedItems, setFeedItems] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Normalize category name and memoize the query
  const normalizedCategory = useMemo(() => normalizeCategoryName(category), [category]);

  const postsQuery = useMemo(() => {
    const postsRef = collection(db, 'articles');
    return query(
      postsRef,
      orderBy('createdAt', 'desc'),
      limit(50) // Get more to filter in memory
    );
  }, []);

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return;

    let isMounted = true;

    async function loadArticles() {
      try {
        setIsLoading(true);
        const querySnapshot = await getDocs(postsQuery);
        
        if (!isMounted) return;

        const allPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Filter posts by category (case-insensitive) - now using categoryName from articles collection
        const filteredPosts = allPosts.filter((post: any) => {
          const postCategory = post.categoryName || post.categoryId || '';
          return postCategory.toLowerCase() === normalizedCategory.toLowerCase();
        });

        // Handle Firestore Timestamp conversion
        const getTimestamp = (firestoreTimestamp: any) => {
          if (!firestoreTimestamp) return new Date().toISOString()

          // If it's a Firestore Timestamp object
          if (firestoreTimestamp.toDate && typeof firestoreTimestamp.toDate === 'function') {
            return firestoreTimestamp.toDate().toISOString()
          }

          // If it's already a Date object
          if (firestoreTimestamp instanceof Date) {
            return firestoreTimestamp.toISOString()
          }

          // If it's a string, return as is
          if (typeof firestoreTimestamp === 'string') {
            return firestoreTimestamp
          }

          // Fallback
          return new Date().toISOString()
        }

        const items: Article[] = filteredPosts.slice(0, 12).map((post: any) => ({
          id: post.id,
          title: post.title || 'Untitled',
          content: post.content || post.excerpt || "",
          author: {
            name: post.authorName || "Anonymous",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName || 'Anonymous')}&background=random`
          },
          category: post.categoryName || post.categoryId || normalizedCategory,
          timestamp: getTimestamp(post.createdAt || post.updatedAt),
          image: post.image || post.coverImage || '/placeholder.jpg'
        }));

        if (isMounted) {
          setFeedItems(items);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load articles');
          console.error('Error loading articles:', error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadArticles();

    return () => {
      isMounted = false;
    };
  }, [category, mounted, postsQuery]);

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