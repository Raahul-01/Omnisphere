"use client"

import React, { JSX } from 'react'
import type { ReactNode } from 'react'
import { useEffect, useState, useRef, useCallback } from "react"
import { collection, query, orderBy, limit, getDocs, startAfter, where, DocumentData } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, BookmarkPlus, TrendingUp, Crown, Star, ArrowRight, BookOpen, LineChart } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { categoryColors } from "@/lib/categories"

interface Article extends DocumentData {
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
  features?: {
    best_of_week?: boolean;
    trending_news?: boolean;
  };
}

interface FeaturedSection {
  title: string;
  articles: Article[];
  type: 'best-of-week' | 'trending' | 'editor-picks';
  icon: React.ElementType;
  color: string;
}

interface CategoryStats {
  name: string;
  count: number;
  color: string;
}

export function HomeFeed() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null)
  const [featuredSections, setFeaturedSections] = useState<FeaturedSection[]>([])
  const [categories, setCategories] = useState<CategoryStats[]>([])
  const observerTarget = useRef<HTMLDivElement>(null)

  // ArticleCard component definition
  const ArticleCard = ({ article }: { article: Article }) => (
    <Link 
      href={`/article/${article.id}`}
      className="group"
    >
      <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="relative h-52 overflow-hidden">
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
  )

  const fetchFeaturedSections = async () => {
    try {
      // Fetch articles from the 'articles' collection instead of 'generated_content'
      // Since the articles collection doesn't have feature flags, we'll use different logic

      // Fetch articles without ordering first (to avoid index issues)
      const bestOfWeekQuery = query(
        collection(db, 'articles'),
        limit(6)
      )
      const bestOfWeekSnapshot = await getDocs(bestOfWeekQuery)

      // Fetch articles for Trending (skip first 2, take next 4)
      const trendingQuery = query(
        collection(db, 'articles'),
        limit(10) // Get more to skip some
      )
      const trendingSnapshot = await getDocs(trendingQuery)

      // Fetch Editor's Picks (random selection from available articles)
      const editorPicksQuery = query(
        collection(db, 'articles'),
        limit(6)
      )
      const editorPicksSnapshot = await getDocs(editorPicksQuery)

      const sections: FeaturedSection[] = [
        {
          title: "Best of the Week",
          articles: bestOfWeekSnapshot.docs.map(doc => ({
            id: doc.id,
            ...mapArticleDataFromArticlesCollection(doc.data())
          })),
          type: 'best-of-week',
          icon: Crown,
          color: 'text-yellow-500'
        },
        {
          title: "Trending Now",
          // Skip first 2 articles and take next 4 for variety
          articles: trendingSnapshot.docs.slice(2, 6).map(doc => ({
            id: doc.id,
            ...mapArticleDataFromArticlesCollection(doc.data())
          })),
          type: 'trending',
          icon: TrendingUp,
          color: 'text-orange-500'
        },
        {
          title: "Editor's Picks",
          // Take different articles for editor's picks
          articles: editorPicksSnapshot.docs.slice(1, 5).map(doc => ({
            id: doc.id,
            ...mapArticleDataFromArticlesCollection(doc.data())
          })),
          type: 'editor-picks',
          icon: Star,
          color: 'text-blue-500'
        }
      ]

      setFeaturedSections(sections)
    } catch (error) {
      console.error("Error fetching featured sections:", error)
    }
  }

  // Map data from the old generated_content collection format
  const mapArticleData = (data: any) => {
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

    return {
      title: (data.original_headline || data.headline || "Untitled").replace(/\*\*|##/g, ''),
      content: (data.content || "").replace(/\*\*|##/g, ''),
      author: {
        name: data.user || "Anonymous",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user || 'anonymous'}`
      },
      category: data.category || "General",
      timestamp: getTimestamp(data.time),
      image: data.image_url || "/placeholder.jpg",
      features: data.features || {}
    }
  }

  // Map data from the new articles collection format
  const mapArticleDataFromArticlesCollection = (data: any) => {
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

    return {
      title: (data.title || "Untitled").replace(/\*\*|##/g, ''),
      content: (data.content || data.excerpt || "").replace(/\*\*|##/g, ''),
      author: {
        name: data.authorName || "Anonymous",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.authorName || 'anonymous'}`
      },
      category: data.categoryName || data.categoryId || "General",
      timestamp: getTimestamp(data.createdAt || data.updatedAt),
      image: data.image || data.coverImage || "/placeholder.jpg",
      features: {} // Articles collection doesn't have features, so empty object
    }
  }

  const fetchArticles = async (lastVisible?: any) => {
    try {
      console.log('🔄 HomeFeed: Fetching articles from articles collection...');
      const articlesRef = collection(db, 'articles')

      // Fetch from articles collection using createdAt for ordering
      let q = query(
        articlesRef,
        orderBy('createdAt', 'desc'),
        limit(30)
      )

      if (lastVisible) {
        q = query(
          articlesRef,
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(30)
        )
      }

      const querySnapshot = await getDocs(q)
      console.log(`✅ HomeFeed: Found ${querySnapshot.size} articles out of ${30} requested`);

      if (querySnapshot.empty) {
        console.log('❌ HomeFeed: No articles found');
        setHasMore(false)
        return
      }

      // Check if we have more documents
      const hasMoreDocs = querySnapshot.size === 30
      setHasMore(hasMoreDocs)

      if (querySnapshot.size > 0) {
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1])
      }

      const fetchedArticles: Article[] = []

      querySnapshot.docs.forEach(doc => {
        try {
          const article = {
            id: doc.id,
            ...mapArticleDataFromArticlesCollection(doc.data())
          }
          fetchedArticles.push(article)
        } catch (error) {
          console.error(`❌ Error processing document ${doc.id}:`, error);
        }
      })

      console.log('📄 HomeFeed: Sample articles:', fetchedArticles.slice(0, 2));

      if (lastVisible) {
        setArticles(prev => [...prev, ...fetchedArticles])
      } else {
        setArticles(fetchedArticles)
      }
      } catch (error) {
        console.error("❌ HomeFeed: Error fetching articles:", error)
      } finally {
        setLoading(false)
      }
    }

  // Intersection Observer callback
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0]
    if (target.isIntersecting && hasMore && !loading) {
      fetchArticles(lastDoc)
    }
  }, [hasMore, loading, lastDoc])

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    })

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [handleObserver])

  const fetchCategoryStats = async () => {
    try {
      const categoriesRef = collection(db, 'generated_content')
      const snapshot = await getDocs(categoriesRef)
      
      // Count articles per category
      const categoryCount: { [key: string]: number } = {}
      snapshot.docs.forEach(doc => {
        const category = doc.data().category || 'Uncategorized'
        categoryCount[category] = (categoryCount[category] || 0) + 1
      })

      // Use centralized category colors

      // Convert to array and sort by count
      const categoryStats = Object.entries(categoryCount)
        .map(([name, count]) => ({
          name,
          count,
          color: categoryColors[name] || 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8) // Get top 8 categories

      setCategories(categoryStats)
    } catch (error) {
      console.error("Error fetching category stats:", error)
    }
  }

  useEffect(() => {
    fetchArticles()
    fetchFeaturedSections()
    fetchCategoryStats()
  }, [])

  const renderFeaturedSection = (section: FeaturedSection) => {
    const Icon = section.icon
    return (
      <div key={section.type} className="my-12 relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${section.type === 'best-of-week' ? 'bg-yellow-100 dark:bg-yellow-900/20' : section.type === 'trending' ? 'bg-orange-100 dark:bg-orange-900/20' : 'bg-blue-100 dark:bg-blue-900/20'}`}>
              <Icon className={`h-6 w-6 ${section.color}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{section.title}</h2>
              <p className="text-sm text-muted-foreground">
                {section.type === 'best-of-week' ? 'Most impactful stories of the week' : section.type === 'trending' ? 'What everyone is reading' : 'Editor\'s picks'}
              </p>
            </div>
          </div>
          <Link href={`/${section.type}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {section.type === 'best-of-week' ? (
          // Best of Week Layout - Horizontal Cards
          <div className="grid grid-cols-1 gap-6">
            {section.articles.map((article, index) => (
              <Link 
                key={article.id}
                href={`/article/${article.id}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="relative w-full md:w-[300px] h-48 md:h-auto">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge 
                        variant="secondary" 
                        className="absolute top-4 left-4 bg-yellow-500/90 text-white"
                      >
                        #{index + 1} This Week
                      </Badge>
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-2">
                          {article.content.slice(0, 150)}...
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
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
                        <Badge variant="secondary" className="ml-auto">
                          {article.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : section.type === 'trending' ? (
          // Trending Now Layout - Grid with Overlay
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {section.articles.map((article, index) => (
              <Link 
                key={article.id}
                href={`/article/${article.id}`}
                className="group"
              >
                <Card className="relative h-[400px] overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="absolute inset-0">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  </div>
                  <div className="relative h-full p-6 flex flex-col justify-end text-white">
                    <Badge 
                      variant="secondary" 
                      className="mb-4 bg-orange-500/90 text-white self-start"
                    >
                      Trending #{index + 1}
                    </Badge>
                    <h3 className="text-xl font-bold mb-3 line-clamp-3 group-hover:text-orange-400 transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-white/90">
                      <Avatar className="h-6 w-6 ring-2 ring-orange-500/50">
                        <AvatarImage src={article.author.avatar} />
                        <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm">{article.author.name}</p>
                      <span className="text-xs">·</span>
                      <p className="text-xs">
                        {formatDistanceToNow(new Date(article.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          // Editor's Picks Layout - Grid with Overlay
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {section.articles.map((article, index) => (
              <Link 
                key={article.id}
                href={`/article/${article.id}`}
                className="group"
              >
                <Card className="relative h-[400px] overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="absolute inset-0">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  </div>
                  <div className="relative h-full p-6 flex flex-col justify-end text-white">
                    <Badge 
                      variant="secondary" 
                      className="mb-4 bg-blue-500/90 text-white self-start"
                    >
                      Editor's Pick
                    </Badge>
                    <h3 className="text-xl font-bold mb-3 line-clamp-3 group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-white/90">
                      <Avatar className="h-6 w-6 ring-2 ring-blue-500">
                        <AvatarImage src={article.author.avatar} />
                        <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm">{article.author.name}</p>
                      <span className="text-xs">·</span>
                      <p className="text-xs">
                        {formatDistanceToNow(new Date(article.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Add this new section right after the featured sections render
  const renderCategories = () => (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {categories.map((category) => (
          <Link 
            key={category.name}
            href={`/category/${category.name.toLowerCase()}`}
            className="group"
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-300">
              <div className={`inline-flex items-center px-3 py-1 rounded-full ${category.color} mb-4`}>
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{category.count}</span>
                <span className="text-sm text-muted-foreground">stories</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )

  const renderBestOfWeekFeed = () => (
    <div className="my-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-yellow-500 shadow-lg shadow-yellow-500/20">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Best of the Week</h2>
            <p className="text-sm text-muted-foreground">Curated excellence from our top stories</p>
          </div>
        </div>
        <Link href="/best-of-week">
          <Button variant="secondary" size="sm" className="gap-2 shadow-md">
            View All Stories
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Featured Article */}
        {featuredSections[0]?.articles[0] && (
          <Link 
            href={`/article/${featuredSections[0].articles[0].id}`}
            className="col-span-12 lg:col-span-6 group"
          >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
              <div className="relative h-[400px]">
                <Image
                  src={featuredSections[0].articles[0].image}
                  alt={featuredSections[0].articles[0].title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <Badge 
                    variant="secondary" 
                    className="w-fit mb-4 bg-yellow-500 text-white"
                  >
                    #1 Story This Week
                  </Badge>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
                    {featuredSections[0].articles[0].title}
                  </h3>
                  <p className="text-white/80 line-clamp-2 mb-4">
                    {featuredSections[0].articles[0].content.slice(0, 150)}...
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-2 ring-yellow-500">
                      <AvatarImage src={featuredSections[0].articles[0].author.avatar} />
                      <AvatarFallback>{featuredSections[0].articles[0].author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-white">
                      <p className="text-sm font-medium">{featuredSections[0].articles[0].author.name}</p>
                      <p className="text-xs text-white/70">
                        {formatDistanceToNow(new Date(featuredSections[0].articles[0].timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        )}

        {/* Secondary Articles */}
        <div className="col-span-12 lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {featuredSections[0]?.articles.slice(1, 5).map((article, index) => (
            <Link 
              key={article.id}
              href={`/article/${article.id}`}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white dark:bg-zinc-900">
                <div className="relative h-32">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 left-2 bg-yellow-500/90 text-white"
                  >
                    #{index + 2} This Week
                  </Badge>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold line-clamp-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors mb-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-auto pt-3 border-t">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={article.author.avatar} />
                      <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {article.author.name} · {formatDistanceToNow(new Date(article.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )

  if (loading && articles.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
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
    )
  }

  // Separate first article for featured display
  const [featuredArticle, ...restArticles] = articles

  return (
    <>
      {/* Featured Article */}
      {featuredArticle && (
        <section className="relative mb-8">
          <Link href={`/article/${featuredArticle.id}`}>
            <Card className="group">
              <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden rounded-xl">
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                  <div className="w-full space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <Badge className="bg-primary hover:bg-primary/90 text-white px-4 py-1 text-sm">
                        Featured Story
                      </Badge>
                      <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                        {featuredArticle.category}
                      </Badge>
                    </div>
                  
                    <h1 className="text-3xl md:text-5xl font-bold text-white group-hover:text-primary/90 transition-colors">
                      {featuredArticle.title}
                    </h1>
                    
                    <p className="text-white/90 text-base md:text-lg line-clamp-2 max-w-3xl">
                      {featuredArticle.content.slice(0, 200)}...
                    </p>

                    <div className="flex items-center justify-between gap-4 pt-6 border-t border-white/20">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-primary">
                          <AvatarImage src={featuredArticle.author.avatar} />
                          <AvatarFallback>{featuredArticle.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{featuredArticle.author.name}</p>
                          <p className="text-white/80 text-sm">
                            {formatDistanceToNow(new Date(featuredArticle.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <Button size="lg" variant="secondary" className="gap-2">
                        Read Story
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </section>
      )}

      {/* Regular Articles Grid with interspersed sections */}
      <section className="mb-12">
        {/* First batch of articles (0-14) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 w-full mb-12">
          {restArticles.slice(0, 15).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* Best of Week Section */}
        {featuredSections[0] && featuredSections[0].articles.length > 0 && (
          <div className="mb-12">
            {renderBestOfWeekFeed()}
          </div>
        )}

        {/* Second batch of articles (15-29) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 w-full mb-12">
          {restArticles.slice(15, 30).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* Trending Section - Compact Layout */}
        {featuredSections[1] && featuredSections[1].articles.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/20">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Trending Now</h2>
                  <p className="text-sm text-muted-foreground">What everyone is reading</p>
                </div>
              </div>
              <Link href="/trending">
                <Button variant="secondary" size="sm" className="gap-2 shadow-md">
                  View All Trending
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {featuredSections[1].articles.slice(0, 4).map((article, index) => (
                <Link 
                  key={article.id} 
                  href={`/article/${article.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      <Badge 
                        variant="secondary" 
                        className="absolute top-2 left-2 bg-orange-500/90 text-white"
                      >
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={article.author.avatar} />
                          <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {article.author.name}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Third batch of articles (30-44) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 w-full mb-12">
          {restArticles.slice(30, 45).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* Editor's Picks Section */}
        {featuredSections[2] && featuredSections[2].articles.length > 0 && (
          <div className="mb-12">
            {renderFeaturedSection(featuredSections[2])}
          </div>
        )}

        {/* Categories Section */}
        <div className="mb-12">
          {renderCategories()}
        </div>

        {/* Fourth batch of articles (45+) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 w-full mb-12">
          {restArticles.slice(45).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* Loading indicator and observer target */}
        <div ref={observerTarget} className="py-8 flex justify-center">
          {loading && hasMore && (
            <div className="animate-pulse flex space-x-4">
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            </div>
          )}
        </div>
      </section>
    </>
  )
} 