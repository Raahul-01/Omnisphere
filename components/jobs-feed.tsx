"use client"

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, Clock, Building2, Search, X, DollarSign } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface JobArticle {
  id: string;
  title: string;
  content: string;
  company: string;
  location: string;
  salary: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  timestamp: string;
  image: string;
  tags: string[];
  job_type: string;
  experience_level: string;
}

interface JobsFeedProps {
  articles: JobArticle[];
}

export function JobsFeed({ articles }: JobsFeedProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Extract unique locations and companies
  const locations = useMemo(() => {
    return Array.from(new Set(articles.map(article => article.location)))
  }, [articles])

  const companies = useMemo(() => {
    return Array.from(new Set(articles.map(article => article.company)))
  }, [articles])

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    articles.forEach(article => {
      article.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  }, [articles])

  // Filter articles based on all criteria
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesLocation = !selectedLocation || article.location === selectedLocation
      const matchesCompany = !selectedCompany || article.company === selectedCompany
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => article.tags.includes(tag))

      return matchesSearch && matchesLocation && matchesCompany && matchesTags
    })
  }, [articles, searchTerm, selectedLocation, selectedCompany, selectedTags])

  // Handle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('')
    setSelectedLocation('')
    setSelectedCompany('')
    setSelectedTags([])
  }

  return (
    <div className="container relative mx-auto px-4 py-6 ml-[240px] max-w-[calc(100vw-240px)]">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Briefcase className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Career & Jobs</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore career opportunities and professional insights
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-4">
          {/* Search Input */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Location Filter */}
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Company Filter */}
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Companies</SelectItem>
              {companies.map(company => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Reset Filters
          </Button>
        </div>

        {/* Tags Filter */}
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Found {filteredArticles.length} {filteredArticles.length === 1 ? 'result' : 'results'}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <Link key={article.id} href={`/article/${article.id}`}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{article.company}</span>
                  </div>

                  <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h2>

                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{article.location}</span>
                  </div>

                  {article.salary !== "Not Specified" && (
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{article.salary}</span>
                    </div>
                  )}

                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {article.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        width={24}
                        height={24}
                        className="rounded-full"
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
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No matches found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 