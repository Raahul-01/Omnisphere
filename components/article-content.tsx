'use client';

import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ArticleContentProps {
  article: {
    id: string
    title: string
    content: string
    author: {
      name: string
      avatar?: string
    }
    category: string
    contentType: string
    createdAt: string
    imageUrl?: string
    trendingNews?: string
    features: {
      home: boolean
      breakingNews: boolean
      articles: boolean
      jobsCareers: boolean
      trendingNews: boolean
      categories: boolean
      bestOfWeek: boolean
      history: boolean
      bookmarks: boolean
    }
  }
}

export function ArticleContent({ article }: ArticleContentProps) {
  const formatText = (text: string) => {
    return text.split(/(\*\*.*?\*\*|^##\s.*$|^###\s.*$)/m).map((part, index) => {
      // Handle bold text
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="dark:text-white">{part.slice(2, -2)}</strong>;
      }
      
      // Handle level 2 heading
      if (part.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-6 mb-4 dark:text-white">
            {part.slice(3)}
          </h2>
        );
      }
      
      // Handle level 3 heading
      if (part.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold mt-5 mb-3 dark:text-white">
            {part.slice(4)}
          </h3>
        );
      }
      
      return part;
    });
  };

  return (
    <article className="max-w-4xl mx-auto bg-white dark:bg-[#121212] p-6">
      <header className="mb-8">
        <div className="flex gap-2 mb-4">
          {article.features.breakingNews && (
            <Badge variant="destructive">Breaking News</Badge>
          )}
          {article.features.trendingNews && (
            <Badge variant="secondary" className="bg-primary">
              Trending
            </Badge>
          )}
          {article.contentType && (
            <Badge variant="outline">{article.contentType}</Badge>
          )}
        </div>

        <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-white">{article.title}</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Avatar className="w-10 h-10">
              <AvatarImage src={article.author.avatar} alt={article.author.name} />
              <AvatarFallback>{article.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{article.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Badge variant="secondary">
            {article.category}
          </Badge>
          {article.trendingNews && (
            <p className="text-sm text-muted-foreground">
              Trending: {article.trendingNews}
            </p>
          )}
        </div>

        {article.imageUrl && (
          <div className="relative w-full h-[400px] mb-8">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        )}
      </header>

      <div className="space-y-6">
        {article.content.split('\n').map((paragraph, index) => (
          paragraph.trim() && (
            <div 
              key={index} 
              className="text-lg text-zinc-900 dark:text-zinc-100"
            >
              {formatText(paragraph)}
            </div>
          )
        ))}
      </div>
    </article>
  )
} 