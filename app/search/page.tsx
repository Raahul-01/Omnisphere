"use client"

import React from 'react'
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
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

// Mock search results
const mockSearchResults: Article[] = [
  {
    id: '1',
    title: 'Technology Breakthrough in AI Research',
    content: 'Latest developments in artificial intelligence are showing promising results for future applications.',
    author: {
      name: 'AI Researcher',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai'
    },
    category: 'Technology',
    timestamp: new Date().toISOString(),
    image: '/placeholder.jpg'
  },
  {
    id: '2',
    title: 'Global Economic Trends and Analysis',
    content: 'Economic experts analyze current global trends and provide insights for the upcoming quarter.',
    author: {
      name: 'Economic Analyst',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=economics'
    },
    category: 'Business',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    image: '/placeholder.jpg'
  }
];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Article[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setIsSearching(true)
    
    // Simulate search delay
    setTimeout(() => {
      if (term.trim()) {
        const filtered = mockSearchResults.filter(article =>
          article.title.toLowerCase().includes(term.toLowerCase()) ||
          article.content.toLowerCase().includes(term.toLowerCase()) ||
          article.category.toLowerCase().includes(term.toLowerCase())
        )
        setResults(filtered)
      } else {
        setResults([])
      }
      setIsSearching(false)
    }, 500)
  }

  const ArticleCard = ({ article }: { article: Article }) => (
    <Link 
      href={`/article/${article.id}`}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="flex">
          <div className="relative w-32 h-32 flex-shrink-0">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <Badge variant="secondary" className="text-xs">
                {article.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(article.timestamp), { addSuffix: true })}
              </span>
            </div>
            <h3 className="font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2">
              {article.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {article.content}
            </p>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={article.author.avatar} />
                <AvatarFallback>{article.author.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{article.author.name}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Articles</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for articles, topics, or authors..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
      </div>

      {isSearching && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Searching...</p>
        </div>
      )}

      {searchTerm && !isSearching && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            {results.length > 0 
              ? `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${searchTerm}"`
              : `No results found for "${searchTerm}"`
            }
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {!searchTerm && !isSearching && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Start your search</h2>
          <p className="text-muted-foreground">
            Enter keywords to find articles, topics, or authors you're interested in.
          </p>
        </div>
      )}
    </div>
  )
}

