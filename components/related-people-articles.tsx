"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface RelatedPeopleArticlesProps {
  articles: any[]
}

export function RelatedPeopleArticles({ articles }: RelatedPeopleArticlesProps) {
  return (
    <div className="mt-12 border-t pt-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold">Related People Stories</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link key={article.id} href={`/article/${article.id}`}>
            <Card className="h-full hover:shadow-lg transition-all group">
              {article.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 right-2 bg-black/70"
                  >
                    {article.category}
                  </Badge>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-muted-foreground">{article.author.name}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {formatDistanceToNow(new Date(article.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 