"use client"

import React from 'react'
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
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
}

// Mock articles for category
const mockCategoryArticles: Article[] = [
  {
    id: '1',
    title: 'Latest Technology News and Updates',
    content: 'Stay informed with the latest developments in technology, including breakthroughs in AI, quantum computing, and more.',
    author: {
      name: 'Tech Reporter',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech'
    },
    category: 'Technology',
    timestamp: new Date().toISOString(),
    image: '/placeholder.jpg'
  },
  {
    id: '2',
    title: 'Business Market Analysis for 2024',
    content: 'Comprehensive analysis of current market trends and future predictions for the business sector.',
    author: {
      name: 'Business Analyst',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=business'
    },
    category: 'Business',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    image: '/placeholder.jpg'
  }
];

interface CategoryFeedProps {
  category?: string;
}

export function CategoryFeed({ category = 'All' }: CategoryFeedProps) {
  const [articles] = useState<Article[]>(mockCategoryArticles)

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

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">
          {category === 'All' ? 'All Articles' : `${category} Articles`}
        </h2>
        <p className="text-muted-foreground">Explore articles in this category</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <div className="text-center pt-8">
        <p className="text-muted-foreground">
          More {category.toLowerCase()} articles coming soon!
        </p>
      </div>
    </div>
  )
} 