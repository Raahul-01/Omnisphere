"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp } from "lucide-react"

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
  tags: string[];
  features?: {
    breakingNews?: boolean;
    trendingNews?: boolean;
  };
}

interface ArticleFeedProps {
  articles: Article[];
}

function formatContent(content: string): string {
  return content
    // Remove markdown headers (##)
    .replace(/#{2,6}\s/g, '')
    // Remove bold markers (**)
    .replace(/\*\*/g, '')
    // Remove any other markdown syntax you want to clean
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // Remove links but keep text
    .replace(/`/g, '') // Remove code blocks
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim();
}

export function ArticleFeed({ articles }: ArticleFeedProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Link 
          key={article.id} 
          href={`/article/${article.id}`}
          className="group"
        >
          <div className="bg-white dark:bg-[#1c1c1c] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 h-full border border-border">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={article.image || '/placeholder.jpg'}
                alt={article.title}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90 dark:bg-black/50 text-foreground">
                  {article.category}
                </Badge>
              </div>
              {/* Breaking News Badge */}
              {article.features?.breakingNews && (
                <div className="absolute top-4 right-4">
                  <Badge variant="destructive" className="animate-pulse">
                    Breaking News
                  </Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Title */}
              <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {formatContent(article.title)}
              </h3>

              {/* Preview Text */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {formatContent(article.content).slice(0, 120)}...
              </p>

              {/* Author and Date */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={article.author.avatar} />
                    <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{article.author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(article.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {/* Reading Time or Trending Indicator */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {article.features?.trendingNews ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span>Trending</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4" />
                      <span>{Math.ceil(article.content.length / 1000)} min read</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
} 