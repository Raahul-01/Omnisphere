"use client"

import React from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, BookmarkPlus, TrendingUp, Crown, Star, ArrowRight, BookOpen, LineChart } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, limit, getDocs, DocumentData } from "firebase/firestore"
import { CategoryFeed } from "@/components/category-feed"
import { LeftSidebar } from "@/components/left-sidebar"

interface CategoryPageContentProps {
  category: string
}

export function CategoryPageContent({ category }: CategoryPageContentProps) {
  const decodedCategory = decodeURIComponent(category)

  return (
    <main className="flex min-h-screen relative">
      <LeftSidebar />
      <div className="flex-1 flex flex-col md:ml-[240px] md:mr-[240px]">
        {/* Static Header */}
        <div className="fixed top-0 left-0 right-0 z-30 bg-background md:fixed md:left-[240px] md:right-[240px]">
          <div className="h-14 flex items-center justify-center border-b">
            <span className="text-lg font-bold capitalize">{decodedCategory}</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 w-full mt-[60px] px-4">
          <CategoryFeed category={decodedCategory} />
        </div>
      </div>
    </main>
  )
} 