"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Clock, Trophy, Star, TrendingUp, Crown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface BestOfWeekFeedProps {
  articles: any[]
}

export function BestOfWeekFeed({ articles }: BestOfWeekFeedProps) {
  const [featuredArticle, ...restArticles] = articles

  return (
    <div className="px-4 py-4">
      {/* Hero Section with Featured Article */}
      <div className="relative min-h-[60vh] md:min-h-[80vh] mb-8 md:mb-16 rounded-2xl md:rounded-3xl overflow-hidden">
        {/* Background Image */}
        {featuredArticle && (
          <>
            <div className="absolute inset-0">
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/90" />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="pt-8 md:pt-12 pb-6 md:pb-8 text-center">
                <div className="inline-block bg-black/30 backdrop-blur-md rounded-full px-4 md:px-8 py-2 mb-4">
                  <div className="flex items-center justify-center gap-2 md:gap-3">
                    <Crown className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" />
                    <h1 className="text-xl md:text-2xl font-bold text-white">Best of the Week</h1>
                    <Crown className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Featured Article Content */}
              <div className="flex-1 flex items-center justify-center px-4 py-4 md:py-8">
                <div className="max-w-4xl w-full">
                  <Link href={`/article/${featuredArticle.id}`}>
                    <div className="space-y-4 md:space-y-6 text-center">
                      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                        <Badge className="bg-yellow-500/90 text-white px-3 md:px-4 py-1 md:py-1.5">
                          <Trophy className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" /> Featured Story
                        </Badge>
                        <Badge variant="secondary" className="bg-white/10 text-white px-3 md:px-4 py-1 md:py-1.5">
                          {featuredArticle.category}
                        </Badge>
                      </div>
                      
                      <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white hover:text-yellow-400 transition-colors line-clamp-3 md:line-clamp-none">
                        {featuredArticle.title}
                      </h2>
                      
                      <p className="text-base md:text-xl text-gray-200 max-w-3xl mx-auto line-clamp-2 md:line-clamp-3">
                        {featuredArticle.content.slice(0, 200)}...
                      </p>

                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="bg-white hover:bg-yellow-500 text-black hover:text-white transition-colors gap-2 mt-4 md:mt-6"
                      >
                        Read Full Story <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                      </Button>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Author Info */}
              <div className="pb-6 md:pb-8 flex justify-center">
                <div className="bg-black/30 backdrop-blur-md rounded-full px-4 md:px-6 py-2 md:py-3 flex items-center gap-3 md:gap-4">
                  <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-2 ring-yellow-500">
                    <AvatarImage src={featuredArticle.author.avatar} />
                    <AvatarFallback>{featuredArticle.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-white">
                    <p className="font-medium text-sm md:text-base">{featuredArticle.author.name}</p>
                    <p className="text-xs md:text-sm text-gray-300">
                      {formatDistanceToNow(new Date(featuredArticle.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* More Stories Section */}
      <div className="space-y-8 md:space-y-12">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">More Top Stories</h2>
          <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto rounded-full" />
        </div>

        {/* Articles Grid with Masonry Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {restArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className={`${index % 3 === 0 ? 'sm:row-span-2' : ''} h-[350px] sm:h-[400px]`}
            >
              <Link href={`/article/${article.id}`} className="group h-full">
                <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-full">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs md:text-sm">
                            <Star className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" /> #{index + 2}
                          </Badge>
                          {article.category && (
                            <Badge variant="secondary" className="bg-white/10 text-white text-xs md:text-sm">
                              {article.category}
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-2">
                          {article.title}
                        </h3>

                        <div className="flex items-center justify-between text-white/90">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7 md:h-8 md:w-8 ring-1 ring-yellow-500/50">
                              <AvatarImage src={article.author.avatar} />
                              <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs md:text-sm line-clamp-1">{article.author.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs md:text-sm">
                            <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            <span>{Math.ceil(article.content.length / 1000)} min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BestOfWeekFeed 