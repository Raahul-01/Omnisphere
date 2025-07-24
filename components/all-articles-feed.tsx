"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { FileText, Clock, ChevronRight, Filter, Grid, List } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AllArticlesFeedProps {
  articles: any[]
}

export function AllArticlesFeed({ articles }: AllArticlesFeedProps) {
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Clean text by removing markdown symbols
  const cleanText = (text: string) => {
    return text
      ?.replace(/##\s/g, '')  // Remove ## headers
      ?.replace(/\*\*(.*?)\*\*/g, '$1')  // Remove ** bold markers but keep text
      ?.replace(/##,\*/g, '')  // Remove ##,* markers
      || '';
  };

  // Get unique categories for filter
  const categories = Array.from(new Set(articles.map(article => article.category))).sort();

  // Filter and sort articles
  const filteredAndSortedArticles = articles
    .filter(article => filterBy === "all" || article.category === filterBy)
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case "oldest":
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-[#FF7043]" />
          <h1 className="text-3xl font-bold">All Articles</h1>
        </div>
        <p className="text-muted-foreground">
          Browse through all articles and stories ({articles.length} total)
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4 items-center">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Articles Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSortedArticles.length} of {articles.length} articles
          {filterBy !== "all" && ` in ${filterBy}`}
        </p>
      </div>

      {/* Grid/List View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedArticles.map((article) => (
            <Link key={article.id} href={`/article/${article.id}`}>
              <Card className="h-full hover:shadow-lg transition-all group">
                <div className="relative">
                  {article.image && (
                    <img
                      src={article.image}
                      alt={cleanText(article.title)}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <Badge 
                    variant="secondary" 
                    className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white"
                  >
                    {article.category}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-[#FF7043] transition-colors line-clamp-2">
                    {cleanText(article.title)}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {cleanText(article.content?.substring(0, 100))}...
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-muted-foreground">{article.author.name}</span>
                    </div>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDistanceToNow(new Date(article.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedArticles.map((article) => (
            <Link key={article.id} href={`/article/${article.id}`}>
              <Card className="hover:shadow-lg transition-all group">
                <div className="flex gap-4 p-4">
                  {article.image && (
                    <div className="relative w-32 h-24 flex-shrink-0">
                      <img
                        src={article.image}
                        alt={cleanText(article.title)}
                        className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold group-hover:text-[#FF7043] transition-colors line-clamp-2">
                        {cleanText(article.title)}
                      </h3>
                      <Badge variant="secondary" className="ml-2 flex-shrink-0">
                        {article.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {cleanText(article.content?.substring(0, 150))}...
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <img
                          src={article.author.avatar}
                          alt={article.author.name}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-muted-foreground">{article.author.name}</span>
                      </div>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDistanceToNow(new Date(article.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedArticles.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No articles found</h3>
          <p className="text-muted-foreground">
            {filterBy !== "all" 
              ? `No articles found in the ${filterBy} category.`
              : "No articles available at the moment."
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default AllArticlesFeed
