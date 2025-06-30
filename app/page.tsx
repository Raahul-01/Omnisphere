"use client"

import { LeftSidebar } from "@/components/left-sidebar"
import { useState, useEffect } from "react"
import { CategoryTabs } from "@/components/category-tabs"
import { HomeFeed } from "@/components/home-feed"
import { PageContainer } from "@/components/layout/page-container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Zap, 
  Cpu, 
  BarChart3, 
  Globe2, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  Star,
  Atom 
} from "lucide-react"
import Image from "next/image"
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
}

interface Category {
  name: string;
  icon: LucideIcon;
  color: string;
  count: number;
  gradient: string;
}

const categories: Category[] = [
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

// Static mock data - no dynamic updates to prevent hydration issues
const featuredStory: FeedItem = {
  id: '1',
  title: 'Breaking: Major Technology Breakthrough Announced',
  content: 'Scientists have announced a revolutionary breakthrough in quantum computing that could change the world as we know it.',
  author: {
    name: 'John Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
  },
  category: 'Technology',
  timestamp: '2024-01-01T12:00:00Z',
  image: '/placeholder.jpg'
};

const trendingStories: FeedItem[] = [
  {
    id: '3',
    title: 'AI Revolution: New Breakthrough Changes Everything',
    content: 'Artificial intelligence reaches new milestone with latest development.',
    author: {
      name: 'Mike Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
    },
    category: 'Technology',
    timestamp: '2024-01-01T10:00:00Z',
    image: '/placeholder.jpg'
  },
  {
    id: '4',
    title: 'Market Surge: Tech Stocks Hit All-Time High',
    content: 'Technology stocks continue their upward trajectory in today\'s trading.',
    author: {
      name: 'Lisa Park',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa'
    },
    category: 'Business',
    timestamp: '2024-01-01T09:00:00Z',
    image: '/placeholder.jpg'
  }
];

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="grid grid-cols-12 gap-6 auto-rows-[200px]">
        {/* Featured Story */}
        <div className="col-span-12 lg:col-span-8 row-span-2 group relative rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500">
          <div className="relative w-full h-full">
            <Image
              src={featuredStory.image}
              alt={featuredStory.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="animate-pulse h-3 w-3 rounded-full bg-red-500" />
                  <Badge className="bg-red-500">Breaking News</Badge>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {featuredStory.title}
                  </h1>
                  <p className="text-gray-200 line-clamp-2 max-w-2xl mt-4">
                    {featuredStory.content.slice(0, 200)}...
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage 
                        src={featuredStory.author.avatar} 
                        alt={featuredStory.author.name} 
                      />
                      <AvatarFallback>
                        {featuredStory.author.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-medium">
                        {featuredStory.author.name}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {formatDistanceToNow(new Date(featuredStory.timestamp), { 
                          addSuffix: true 
                        })}
                      </p>
                    </div>
                  </div>
                  <Link href={`/article/${featuredStory.id}`}>
                    <Button variant="secondary" className="gap-2">
                      <ArrowRight className="h-4 w-4" /> Read More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Stories */}
        <div className="hidden lg:block col-span-4 row-span-2 bg-orange-50 dark:bg-orange-950/20 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-semibold">Trending Now</h2>
          </div>
          <div className="space-y-5">
            {trendingStories.map((story, i) => (
              <Link key={story.id} href={`/article/${story.id}`}>
                <div className="group cursor-pointer py-1">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl font-bold text-orange-500/50 w-8">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 space-y-2">
                      <p className="font-medium group-hover:text-orange-500 transition-colors line-clamp-2">
                        {story.title}
                      </p>
                      <Badge 
                        variant="secondary" 
                        className="text-xs px-2 py-0.5"
                      >
                        {story.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Category Quick Access */}
        {categories.map((category, i) => (
          <Link 
            key={category.name}
            href={`/category/${category.name.toLowerCase()}`}
            className={`col-span-6 md:col-span-3 group relative rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${category.gradient}`}
          >
            <div className="relative h-full p-6 flex flex-col justify-between">
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
          </Link>
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

