"use client"

import { SearchBar } from "@/components/search-bar"
import { LeftSidebar } from "@/components/left-sidebar"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, where, limit } from "firebase/firestore"
import { Feed, FeedItem } from "@/components/feed"
import { useAuth } from "@/lib/auth-context"
import { ContentDisplay } from "@/components/content-display"
import { CategoryTabs } from "@/components/category-tabs"
import { HomeFeed } from "@/components/home-feed"
import { PageContainer } from "@/components/layout/page-container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Zap, 
  Cpu, 
  BarChart3, 
  Globe2, 
  Clock, 
  TrendingUp, 
  Newspaper, 
  Circle, 
  LayoutGrid, 
  List, 
  ArrowRight,
  Star,
  Atom 
} from "lucide-react"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { LucideIcon } from 'lucide-react'

interface FeedItem {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  timestamp: string;
  image: string;
  content: string;
  features?: {
    breaking_news?: boolean;
    trending_news?: boolean;
    home?: boolean;
  };
}

interface Category {
  name: string;
  icon: LucideIcon;
  color: string;
  count: number;
  gradient: string;
}

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const [feedData, setFeedData] = useState<FeedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0)
  const [featuredStories, setFeaturedStories] = useState<FeedItem[]>([])
  const [trendingStories, setTrendingStories] = useState<FeedItem[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch multiple featured stories (e.g., top 5)
        const featuredQuery = query(
          collection(db, 'generated_content'),
          where('features.breaking_news', '==', true),
          orderBy('time', 'desc'),
          limit(5)
        )
        
        const featuredSnapshot = await getDocs(featuredQuery)
        const featured = featuredSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: (data.headline || data.title || "Untitled").replace(/\*\*|##/g, ''),
            content: (data.content || "").replace(/\*\*|##/g, ''),
            author: {
              name: data.user || "Anonymous",
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user || 'anonymous'}`
            },
            category: data.category || "General",
            timestamp: data.time || new Date().toISOString(),
            image: data.image_url || "/placeholder.jpg",
          };
        });

        setFeaturedStories(featured)
        
        // Fetch trending stories
        const trendingQuery = query(
          collection(db, 'generated_content'),
          where('features.trending_news', '==', true),
          orderBy('time', 'desc'),
          limit(5)
        );

        const trendingSnapshot = await getDocs(trendingQuery);

        const extractTitle = (content: string): string => {
          // Check for markdown title patterns and remove them
          const markdownMatch = content.match(/^(?:\*\*|##\s*)([^*#:]+)(?:\*\*|):/)
          if (markdownMatch) {
            return markdownMatch[1].trim()
          }
          return content.replace(/\*\*/g, '').split('\n')[0] // Remove all ** and get first line as fallback
        }

        const trendingContent = trendingSnapshot.docs.map(doc => {
          const data = doc.data();
          const contentTitle = extractTitle(data.content || "");
          
          return {
            id: doc.id,
            title: (data.original_headline || 
                    data.headline || 
                    contentTitle || 
                    "Breaking News").replace(/\*\*/g, ''),
            content: (data.content || "").replace(/\*\*/g, ''),
            author: {
              name: data.user || "Anonymous",
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user || 'anonymous'}`
            },
            category: data.category || "General",
            timestamp: data.time || new Date().toISOString(),
            image: data.image_url || "/placeholder.jpg",
          };
        });

        // If we don't have enough trending stories, fetch recent stories
        if (trendingContent.length < 6) {
          const recentQuery = query(
            collection(db, 'generated_content'),
            orderBy('time', 'desc'),
            limit(6 - trendingContent.length)
          );
          
          const recentSnapshot = await getDocs(recentQuery);
          const recentContent = recentSnapshot.docs
            .filter(doc => !trendingContent.find(t => t.id === doc.id))
            .map(doc => {
              const data = doc.data();
              const contentTitle = extractTitle(data.content || "");
              
              return {
          id: doc.id,
                title: data.original_headline || 
                       data.headline || 
                       contentTitle || 
                       "Breaking News",
                content: data.content || "",
          author: {
                  name: data.user || "Anonymous",
                  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user || 'anonymous'}`
                },
                category: data.category || "General",
                timestamp: data.time || new Date().toISOString(),
                image: data.image_url || "/placeholder.jpg",
              };
            });
            
          trendingContent.push(...recentContent);
        }

        setTrendingStories(trendingContent)

        // Fetch home content
        const homeQuery = query(
          collection(db, 'generated_content'),
          where('features.Home', '==', true),
          orderBy('time', 'desc'),
          limit(10)
        )
        const homeSnapshot = await getDocs(homeQuery)
        const homeContent = homeSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().headline?.replace(/\*\*|##/g, ''),
          author: {
            name: doc.data().user,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.data().user}`
          },
          category: doc.data().category,
          timestamp: doc.data().time,
          image: doc.data().image_url,
          format: "hourglass" as const,
          lead: doc.data().content?.replace(/\*\*|##/g, '').substring(0, 100) + "...",
          body: doc.data().content?.replace(/\*\*|##/g, ''),
          tail: "Read more...",
          priority: 3
        }))

        // Combine and sort all content
        const allContent = [...featured, ...trendingContent, ...homeContent]
        const sortedContent = allContent.sort((a, b) => {
          if (a.priority !== b.priority) {
            return a.priority - b.priority
          }
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        })

        setFeedData(sortedContent)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      fetchData()
    }
  }, [authLoading])

  // Rotate featured stories every 2 seconds
  useEffect(() => {
    if (featuredStories.length === 0) return;

    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => 
        prev === featuredStories.length - 1 ? 0 : prev + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [featuredStories.length]);

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const currentFeaturedStory = featuredStories[currentFeaturedIndex];

  return (
    <PageContainer>
      <div className="grid grid-cols-12 gap-6 auto-rows-[200px]">
        {/* Dynamic Featured Story */}
        {currentFeaturedStory && (
          <div className="col-span-12 lg:col-span-8 row-span-2 group relative rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500">
            <div className="relative w-full h-full">
              <Image
                src={currentFeaturedStory.image}
                alt={currentFeaturedStory.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse h-3 w-3 rounded-full bg-red-500" />
                    <Badge className="bg-red-500">Breaking News</Badge>
                    {/* Progress bar */}
                    <div className="ml-auto w-24 h-1 bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-200"
                        style={{ 
                          width: `${((currentFeaturedIndex + 1) / featuredStories.length) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  <div className="transform transition-all duration-500 ease-in-out">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                      {currentFeaturedStory.title.replace(/\*\*|##/g, '')}
                    </h1>
                    <p className="text-gray-200 line-clamp-2 max-w-2xl mt-4">
                      {currentFeaturedStory.content.replace(/\*\*|##/g, '').slice(0, 200)}...
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage 
                          src={currentFeaturedStory.author.avatar} 
                          alt={currentFeaturedStory.author.name} 
                        />
                        <AvatarFallback>
                          {currentFeaturedStory.author.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">
                          {currentFeaturedStory.author.name}
                        </p>
                        <p className="text-gray-300 text-sm">
                          {formatDistanceToNow(new Date(currentFeaturedStory.timestamp), { 
                            addSuffix: true 
                          })}
                        </p>
                      </div>
                    </div>
                    <Link href={`/article/${currentFeaturedStory.id}`}>
                      <Button variant="secondary" className="gap-2">
                        <ArrowRight className="h-4 w-4" /> Read More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trending Stories - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block col-span-4 row-span-2 bg-orange-50 dark:bg-orange-950/20 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-semibold">Trending Now</h2>
          </div>
          <div className="space-y-5">
            {trendingStories.length > 0 ? (
              trendingStories.map((story, i) => (
                <Link key={story.id} href={`/article/${story.id}`}>
                  <div className="group cursor-pointer py-1">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl font-bold text-orange-500/50 w-8">
                        {String(i + 1).padStart(2, '0')}
            </span>
                      <div className="flex-1 space-y-2">
                        <p className="font-medium group-hover:text-orange-500 transition-colors line-clamp-2">
                          {(story.title || story.headline || "Breaking News").replace(/\*\*/g, '')}
                        </p>
                        {story.category && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs px-2 py-0.5"
                          >
                            {story.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                <p>No trending stories yet</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Category Quick Access - 3 columns each */}
        {categories.map((category, i) => (
          <div 
            key={category.name}
            className={`col-span-6 md:col-span-3 group relative rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300`}
            style={{ 
              animationDelay: `${i * 100}ms`,
              background: `linear-gradient(to bottom right, ${category.gradient})`
            }}
          >
            {/* Semi-transparent overlay */}
            <div className={`absolute inset-0 ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
            
            {/* Content */}
            <div className="relative h-full p-6 flex flex-col justify-between bg-gradient-to-br from-black/10 to-black/5 group-hover:from-black/20 group-hover:to-black/10 transition-all duration-300">
              <category.icon className={`h-8 w-8 ${category.color} drop-shadow-lg`} />
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 drop-shadow-sm">
                  {category.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                    {category.count} stories
                  </span>
                  <ArrowRight className="h-4 w-4 text-zinc-900 dark:text-white transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Latest News Feed */}
        <div className="col-span-12 space-y-6">
          <div className="flex items-center justify-between px-4 lg:px-0">
            <h2 className="text-2xl font-bold">Latest Stories</h2>
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" className="gap-2">
                <Clock className="h-4 w-4" /> Recent
              </Button>
              <Button variant="ghost" className="gap-2">
                <TrendingUp className="h-4 w-4" /> Popular
              </Button>
              <Button variant="ghost" className="gap-2">
                <Star className="h-4 w-4" /> Featured
              </Button>
            </div>
          </div>
          <HomeFeed />
        </div>
      </div>
    </PageContainer>
  )
}

const categories = [
  {
    name: 'Technology',
    icon: Cpu,
    color: 'text-blue-500',
    count: 128,
    gradient: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
  },
  {
    name: 'Business',
    icon: BarChart3,
    color: 'text-green-500',
    count: 85,
    gradient: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
  },
  {
    name: 'Science',
    icon: Atom,
    color: 'text-purple-500',
    count: 92,
    gradient: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20'
  },
  {
    name: 'World',
    icon: Globe2,
    color: 'text-orange-500',
    count: 156,
    gradient: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20'
  }
];

