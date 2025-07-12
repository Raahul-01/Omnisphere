"use client"


import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { TrendingUp, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"

interface TrendingFeedProps {
  articles: any[]
}

export function TrendingFeed({ articles }: TrendingFeedProps) {
  // Clean text by removing markdown symbols
  const cleanText = (text: string) => {
    return text
      ?.replace(/##\s/g, '')  // Remove ## headers
      ?.replace(/\*\*(.*?)\*\*/g, '$1')  // Remove ** bold markers but keep text
      ?.replace(/##,\*/g, '')  // Remove ##,* markers
      || '';
  };

  // Split articles into featured and regular
  const [featured, ...rest] = articles;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-[#FF7043]" />
          <h1 className="text-3xl font-bold">Trending Now</h1>
        </div>
        <p className="text-muted-foreground">
          Latest trending stories and updates
        </p>
      </div>

      {/* Featured Article */}
      {featured && (
        <Link href={`/article/${featured.id}`}>
          <Card className="mb-8 overflow-hidden hover:shadow-lg transition-all group">
            <div className="relative h-[400px]">
              {featured.image && (
                <img
                  src={featured.image}
                  alt={cleanText(featured.title)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-[#FF7043]/80 hover:bg-[#FF7043] border-none">
                    Featured
                  </Badge>
                  <Badge variant="outline" className="text-white border-white/30">
                    {featured.category}
                  </Badge>
                  <span className="text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDistanceToNow(new Date(featured.timestamp), { addSuffix: true })}
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-2 group-hover:text-[#FF7043] transition-colors">
                  {cleanText(featured.title)}
                </h2>
                <p className="text-gray-200 line-clamp-2">
                  {cleanText(featured.content?.substring(0, 150))}...
                </p>
              </div>
            </div>
          </Card>
        </Link>
      )}

      {/* Grid of Other Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((article) => (
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
                  className="absolute top-3 right-3 bg-black/70 hover:bg-black/90"
                >
                  {article.category}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[#FF7043] transition-colors line-clamp-2">
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
    </div>
  );
}

export default TrendingFeed 