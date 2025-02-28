"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { collection, query, orderBy, limit, getDocs, startAfter, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, BookmarkPlus, TrendingUp, Crown, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface Article {
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
    trending?: boolean;
  };
}

interface FeaturedSection {
  title: string;
  articles: Article[];
  type: 'best-of-week' | 'trending' | 'editor-picks';
  icon: any;
  color: string;
}

export function HomeFeed() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [lastDoc, setLastDoc] = useState<any>(null)
  const [featuredSections, setFeaturedSections] = useState<FeaturedSection[]>([])
  const observerTarget = useRef<HTMLDivElement>(null)

  const fetchFeaturedSections = async () => {
    try {
      // Fetch Best of Week articles
      const bestOfWeekQuery = query(
        collection(db, 'generated_content'),
        where('features.best_of_week', '==', true),
        orderBy('time', 'desc'),
        limit(3)
      )
      const bestOfWeekSnapshot = await getDocs(bestOfWeekQuery)
      
      // Fetch Trending articles
      const trendingQuery = query(
        collection(db, 'generated_content'),
        where('features.trending', '==', true),
          orderBy('time', 'desc'),
        limit(3)
      )
      const trendingSnapshot = await getDocs(trendingQuery)

      const sections: FeaturedSection[] = [
        {
          title: "Best of the Week",
          articles: bestOfWeekSnapshot.docs.map(doc => ({
            id: doc.id,
            ...mapArticleData(doc.data())
          })),
          type: 'best-of-week',
          icon: Crown,
          color: 'text-yellow-500'
        },
        {
          title: "Trending Now",
          articles: trendingSnapshot.docs.map(doc => ({
            id: doc.id,
            ...mapArticleData(doc.data())
          })),
          type: 'trending',
          icon: TrendingUp,
          color: 'text-orange-500'
        }
      ]

      setFeaturedSections(sections)
    } catch (error) {
      console.error("Error fetching featured sections:", error)
    }
  }

  const mapArticleData = (data: any) => ({
    title: (data.original_headline || data.headline || "Untitled").replace(/\*\*|##/g, ''),
    content: (data.content || "").replace(/\*\*|##/g, ''),
            author: {
              name: data.user || "Anonymous",
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user || 'anonymous'}`
            },
            category: data.category || "General",
            timestamp: data.time || new Date().toISOString(),
            image: data.image_url || "/placeholder.jpg",
    features: data.features || {}
  })

  const fetchArticles = async (lastVisible?: any) => {
    try {
      const articlesRef = collection(db, 'generated_content')
      let q = query(
        articlesRef,
        orderBy('time', 'desc'),
        limit(6)
      )

      if (lastVisible) {
        q = query(
          articlesRef,
          orderBy('time', 'desc'),
          startAfter(lastVisible),
          limit(6)
        )
      }
      
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        setHasMore(false)
        return
      }

      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1])
      
      const fetchedArticles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...mapArticleData(doc.data())
      }))

      if (lastVisible) {
        setArticles(prev => [...prev, ...fetchedArticles])
      } else {
        setArticles(fetchedArticles)
      }
      } catch (error) {
        console.error("Error fetching articles:", error)
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

  useEffect(() => {
    fetchArticles()
    fetchFeaturedSections()
  }, [])

  const renderFeaturedSection = (section: FeaturedSection) => {
    const Icon = section.icon
    return (
      <div key={section.type} className="my-12 relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${section.type === 'best-of-week' ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-orange-100 dark:bg-orange-900/20'}`}>
              <Icon className={`h-6 w-6 ${section.color}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{section.title}</h2>
              <p className="text-sm text-muted-foreground">
                {section.type === 'best-of-week' ? 'Most impactful stories of the week' : 'What everyone is reading'}
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
        ) : (
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
        )}
      </div>
    )
  }

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
    <div className="max-w-[1400px] mx-auto space-y-12 px-4 md:px-6">
      {/* Featured Article */}
      {featuredArticle && (
        <section className="relative w-full">
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
                  <div className="max-w-4xl mx-auto w-full space-y-4">
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

      {/* Best of Week Section */}
      {featuredSections[0] && (
        <section className="w-full">
          {renderFeaturedSection(featuredSections[0])}
        </section>
      )}

      {/* Regular Articles */}
      <section className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {restArticles.slice(0, 6).map((article) => (
          <Link 
            key={article.id} 
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
        ))}
      </div>
      </section>

      {/* Trending Section */}
      {featuredSections[1] && (
        <section className="w-full">
          {renderFeaturedSection(featuredSections[1])}
        </section>
      )}

      {/* Remaining Articles */}
      <section className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {restArticles.slice(6).map((article) => (
          <Link 
            key={article.id} 
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
        ))}
      </div>
      </section>

      {/* Loading indicator and observer target */}
      <div ref={observerTarget} className="w-full py-4 flex justify-center">
        {loading && hasMore && (
          <div className="animate-pulse flex space-x-4">
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  )
} 