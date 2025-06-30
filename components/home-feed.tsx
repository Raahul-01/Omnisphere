"use client"

import React from 'react'
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, Crown, Star } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

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
    editor_picks?: boolean;
  };
}

// Mock articles data
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Breaking: Major Technology Breakthrough Announced',
    content: 'Scientists have announced a revolutionary breakthrough in quantum computing that could change the world as we know it. This development represents years of research and collaboration.',
    author: {
      name: 'Tech Reporter',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech'
    },
    category: 'Technology',
    timestamp: new Date().toISOString(),
    image: '/placeholder.jpg',
    features: { trending: true }
  },
  {
    id: '2',
    title: 'Global Climate Summit Reaches Historic Agreement',
    content: 'World leaders have reached a groundbreaking agreement on climate action at the latest international summit. The agreement includes ambitious targets for carbon reduction.',
    author: {
      name: 'Environment Correspondent',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=environment'
    },
    category: 'World',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    image: '/placeholder.jpg',
    features: { best_of_week: true }
  },
  {
    id: '3',
    title: 'New Economic Policies Show Promising Results',
    content: 'Recent economic policies implemented by the government are showing positive results according to latest quarterly reports. Market analysts are optimistic.',
    author: {
      name: 'Business Analyst',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=business'
    },
    category: 'Business',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    image: '/placeholder.jpg',
    features: { editor_picks: true }
  },
  {
    id: '4',
    title: 'Scientific Discovery Could Lead to New Medicine',
    content: 'Researchers have made a significant discovery that could lead to breakthrough treatments for various diseases. Clinical trials are expected to begin next year.',
    author: {
      name: 'Science Writer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=science'
    },
    category: 'Science',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    image: '/placeholder.jpg'
  },
  {
    id: '5',
    title: 'Sports Championship Delivers Thrilling Finale',
    content: 'The annual championship concluded with an unexpected victory that has fans celebrating worldwide. The final match was described as one of the best in years.',
    author: {
      name: 'Sports Reporter',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sports'
    },
    category: 'Sports',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    image: '/placeholder.jpg'
  }
];

export function HomeFeed() {
  const [articles] = useState<Article[]>(mockArticles)

  // ArticleCard component
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
          {article.features?.trending && (
            <Badge 
              variant="secondary" 
              className="absolute top-4 right-4 bg-orange-500/90 text-white"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          )}
          {article.features?.best_of_week && (
            <Badge 
              variant="secondary" 
              className="absolute top-4 right-4 bg-yellow-500/90 text-white"
            >
              <Crown className="h-3 w-3 mr-1" />
              Best of Week
            </Badge>
          )}
          {article.features?.editor_picks && (
            <Badge 
              variant="secondary" 
              className="absolute top-4 right-4 bg-blue-500/90 text-white"
            >
              <Star className="h-3 w-3 mr-1" />
              Editor's Pick
            </Badge>
          )}
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

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Latest Stories</h2>
        <p className="text-muted-foreground">Stay updated with the latest news and insights</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <div className="text-center pt-8">
        <p className="text-muted-foreground">
          More articles coming soon! This is demonstration content.
        </p>
      </div>
    </div>
  )
} 